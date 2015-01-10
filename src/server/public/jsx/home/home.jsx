HomePage = React.createClass({

    allRooms: [],

    componentDidMount: function () {

        this.updateRoomList();

        eventbus.on("update-room-list", this.updateRoomList);
    },

    componentWillUnmount: function () {
    },

    getInitialState: function () {
        return {rooms: [], search: ""};
    },

    componentDidUpdate: function (prevProps, prevState) {
    },

    updateRoomList: function () {
        var component = this;
        $.ajax({
            url: '/roomlist',
            dataType: 'json',
            success: function (data) {
                component.allRooms = data;
                component.setRoomList(component.state.search);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                router.alert(err.toString(), "Ooops! Something went wrong...");
            }.bind(this)
        });
    },

    setRoomList: function (search) {
        var component = this;
        if (this.state.search == '') {
            this.setState({rooms: this.allRooms, search: search});
        }
        else {
            this.setState({
                rooms: _.filter(component.allRooms, function (r) {
                        return (r.name.toLowerCase().indexOf(search.toLowerCase()) != -1);
                    }
                ),
                search: search
            });
        }
    },

    onSearchChange: function (e) {
        this.setRoomList(e.target.value);
    },

    clickCreateRoom: function () {
        router.showModal(<RoomEdit />);
    },

    handleKeyDown: function (e) {
        if (e.keyCode == 27) {
            // escape
            this.setRoomList('');
        }
    },

    hideMOTD: function () {
        $('#motd').slideUp();
    },

    render: function () {
        var totalUsers = _.reduce(
                            this.allRooms.map(function (r) {
                                return r.listeners;
                            }),
                            function (a, b) {
                                return a + b;
                            },0);

        return (
            <div id="homecontainer">
                <div className="jumbotron">
                    <div className="container">
                        <div  className="col-sm-8  ">
                            <img src="img/soundbounce-white-bg.png" />
                        </div>
                        <div className="col-xs-12 col-sm-4 col-lg-3 pull-right">
                            <button className="btn btn-primary btn-lg" style={{
                                width: '100%',
                                marginTop: '17px'
                            }} onClick={this.clickCreateRoom}>+ Create room
                            </button>
                        </div>
                    </div>
                </div>
                <div  id="roomlistcontainer" className="fancy-scrollbar" >
                    <div className="row" >
                        <div className="container" id="motd" style={{display: 'none'}}>
                            <div  className="col-sm-12  ">
                                <div className="well">
                                    <button type="button" className="close pull-right" data-dismiss="modal" aria-hidden="true" onClick={this.hideMOTD}>×</button>
                                    <p>Welcome to Soundbounce, where music sounds better together.</p>

                                    <hr/>
                                    <p>
                                        Please get involved and suggest features, report bugs and look at future plans on our
                                        <a href="javascript:eventbus.trigger('open-url', 'https://github.com/pdaddyo/soundbounce/issues');">project page on Github</a>
                                        .
                                    </p>


                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row ">
                        <div className="container">
                            <div className="col-sm-8 home-stats">
                                <i className={'mdi-social-person'}></i> {totalUsers} listeners online
                            </div>
                            <div className="col-xs-12 col-sm-4 col-lg-3 pull-right room-search-container">
                                <div className="form-control-wrapper">
                                    <i className="mdi-action-search" />
                                    <input type="text" className="form-control empty" placeholder="Search" onChange={this.onSearchChange} onKeyDown={this.handleKeyDown} value={this.state.search} />
                                </div>
                            </div>
                            <div className="col-sm-12" style={{display: this.state.rooms.length == 0 ? 'block' : 'none'}}>
                                <h2 className="home-title" >Sorry, no rooms match '{this.state.search}':</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <RoomList rooms={this.state.rooms} />
                    </div>
                </div>
            </div>

        );
    }
});
