var PlaylistItem = React.createClass({displayName: "PlaylistItem",

    isPreviewing:false,

    componentDidMount: function () {
        $('[data-toggle="tooltip"]').tooltip();

    },

    componentWillUnmount: function () {
    },

    onClickVote: function () {
  //      $('.tooltip').remove();

        var track = this.props.track;
        _.defer(function () {
            eventbus.trigger("track-vote", track);
        });
    },

    onClickAdd: function () {

        var track = this.props.track;
        _.defer(function () {
            eventbus.trigger("track-add", track);
        });
    },
    onClickOpenSpotify: function () {
        eventbus.trigger("open-in-spotify", this.props.track);
        //  document.location = 'spotify:track:'+this.props.track.id;

    },

    onClickRemoveTrack: function (e) {
        var component = this;

        if(e.ctrlKey)
        {
            eventbus.trigger("remove-track", component.props.track);
        }
        else {
            router.confirm("Are you sure you want to remove '" + this.props.track.name + "'?", "Confirm remove", function () {
                eventbus.trigger("remove-track", component.props.track);
            });
        }
    },

    previewStart: function () {
        this.isPreviewing = true;
        eventbus.trigger("preview-start", this.props.track);
    },

    previewStop: function () {
        if(this.isPreviewing){
            eventbus.trigger("preview-stop");
            this.isPreviewing = false;
        }
    },

    render: function () {
        if (this.props.track == null) {
            return React.createElement("div", null);
        }

        return (
            React.createElement("div", {id: 'track' + this.props.track.id, className: this.props.canAdd?"spotify-result":"", style: {display:this.props.visible?"block":"none"}}, 
                React.createElement("div", {className: "list-group-item"}, 
                    React.createElement("div", {className: "row-picture"}, 

                        React.createElement("div", {className: "track-icons"}, 
                            React.createElement("span", {className: "hover-hide"}, 
                                React.createElement("a", {href: "javascript:void(0)", onClick: this.onClickRemoveTrack, className: 'btn btn-fab btn-spotify fa fa-trash', "data-toggle": "tooltip", "data-placement": "bottom", title: "", "data-original-title": "Remove track", style: {
                                    overflow: 'visible',
                                    backgroundColor: this.props.color,
                                    display:this.props.canRemove?"inline-block":"none"
                                }, "data-delay": "{\"show\": 500, \"hide\": 0}"}), 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.onClickOpenSpotify, className: 'btn btn-fab btn-spotify fa fa-spotify', "data-toggle": "tooltip", "data-placement": "top", title: "", "data-original-title": "Show in Spotify", style: {
                                overflow: 'visible',
                                backgroundColor: this.props.color
                            }, "data-delay": "{\"show\": 500, \"hide\": 0}"}), 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.onClickVote, className: 'btn btn-fab btn-vote mdi-file-file-upload ' + (this.props.canVote ? '' : 'hide'), "data-toggle": "tooltip", "data-placement": "top", title: "", "data-original-title": "Vote", style: {
                                overflow: 'visible',
                                backgroundColor: this.props.color
                            }, "data-delay": "{\"show\": 500, \"hide\": 0}"})
                                ), 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.onClickAdd, className: 'btn btn-fab btn-add mdi-av-playlist-add ' + (this.props.canAdd ? '' : 'hide'), "data-toggle": "tooltip", "data-placement": "top", title: "", "data-original-title": "Add to room", style: {
                                overflow: 'visible',
                                backgroundColor: this.props.color
                            }, "data-delay": "{\"show\": 500, \"hide\": 0}"})

                        ), 
                        React.createElement("img", {className: "circle art", src: this.props.track.img, alt: "icon", onMouseDown: this.previewStart, onMouseUp: this.previewStop, onMouseOut: this.previewStop, "data-toggle": "tooltip", "data-placement": "top", "data-original-title": "Click and hold to preview"})
                    ), 
                    React.createElement("div", {className: "row-content"}, 
                        React.createElement("h4", {className: "list-group-item-heading hide-overflow", dangerouslySetInnerHTML: {__html:this.props.track.name}}), 
                        React.createElement("p", {className: "list-group-item-text"}, 

                                React.createElement(ArtistList, {artists: this.props.track.artists}), 

                                React.createElement(TrackVoteDisplay, {votes: this.props.track.votes, color: this.props.color, addedBy: this.props.track.addedBy})
                        )
                    )
                ), 
                React.createElement("div", {className: "list-group-separator", style: {display:this.props.isLast?"none":"block"}})
            )

        );


    }
});
