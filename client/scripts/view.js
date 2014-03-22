var messageView = {
  source: undefined,
  nodes: [],
  template: $('#message-template').html(),
  render: function(obj){
    var html = templater(this.template, obj);
    $('.messages').append(html);
  },
  changeSource: function(roomname){
    //debugger;
    if(!!this.source){
      this.source.newMessageNotifier = function(obj){return obj;};
    }
    if(rooms[roomname] === undefined){
      rooms[roomname] = new Room(roomname);
    }
    this.source = rooms[roomname];
    $('.messages').html("");
    this.renderAll();
    var that = this;
    this.source.newMessageNotifier = function(obj){
      that.render(obj);
    };
  },
  renderAll : function(){
    var that = this;
    _.each(this.source.messages, function(obj){
      that.render(obj);
    });
  }
};

var wordRegEx = /^[a-zA-Z0-9\_]+$/;
var roomsView = {
  rooms: {},
  addRoom: function(roomname) {
    if(!this.rooms[roomname] && wordRegEx.test(roomname)) {
      this.rooms[roomname] = true;
      //debugger;
      var html = "<a href='#/room/" + roomname + "'>"+ roomname +"</a>";
      $(".roomlist").append(html);
    }
  }
};

//All done.