var ObjectStorage = function ObjectStorage( name, duration ) {

    var self,
    name = name || '_objectStorage',
    defaultDuration = 5000;
    if ( ObjectStorage.instances[ name ] ) {
        self = ObjectStorage.instances[ name ];
        self.duration = duration || self.duration;
    } else {
        self = this;
        self._name = name;
        self.duration = duration || defaultDuration;
        self._init();
        ObjectStorage.instances[ name ] = self;
    }
    
    return self;
};
ObjectStorage.instances = {};
ObjectStorage.prototype = {
    // type == local || session
    _save: function ( type ) {
        var stringified = JSON.stringify( this[ type ] ),
        storage = window[ type + 'Storage' ];
        if ( storage.getItem( this._name ) !== stringified ) {
            storage.setItem( this._name, stringified );
        }
    },

    _get: function ( type ) {
        this[ type ] = JSON.parse( window[ type + 'Storage' ].getItem( this._name ) ) || {};
    },

    _init: function () {
        var self = this;
        self._get( 'local' );
        self._get( 'session' );

        ( function callee() {
            self.timeoutId = setTimeout( function () {
                self._save( 'local' );
                callee();
            }, self._duration );
        })();

        window.addEventListener( 'beforeunload', function () {
            self._save( 'local' );
            self._save( 'session' );
        });
    },
    timeoutId: null,
    local: {},
    session: {}
};

var storage = new ObjectStorage;
var tasks = new Object();
console.log(tasks);
var tId = 0;



// console.log(tlength);
Drow();
function Drow(){
    tasks = storage.local;
    for(var i in tasks){
        tId = tasks[i].id+1;
    }    
    $('.panel-group').empty();
    var html = "";
    for(var i in tasks){


        // console.log(i +", "+ tasks[i].id);
        html+= '<div class="panel panel-default" id = "t'+tasks[i].id+'">';
        html+= '<div class="panel-heading row">';
        html+= '<h4 class="panel-title col-lg-8">';
        html+= '<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+tasks[i].id+'" class="collapsed">'+tasks[i].name+'</a>';
        html+= '</h4>';
        html+= '<div class="task_control pull-right col-lg-4">';
        html+= '<button type="button" class="btn btn-success">Success</button>';
        html+= '</div>';
        html+= '</div>';
        html+= '<div id="collapse'+tasks[i].id+'" class="panel-collapse collapse in"><div class="panel-body">';
        html+= '';
        html+= '</div></div>';
        html+= '</div>';        
    }
    if(tasks[i].state === true){
        $('#compliteTasks .panel-group').html(html);
        console.log("compliteTasks");
    }
    else{
        $('#newTasks .panel-group').html(html);
        console.log("#newTasks");
    }
    
    html = "";
}

$('#addButton').click(function(){
    tasks["t"+tId] = {
                        date : new Date(),
                        name : $('#taskNameAdd').val(),
                        id : tId,
                        state : false
                      };

    tId += 1;
    $('#taskNameAdd').val(" ");
    console.log(tasks);
    storage.local = tasks;
    Drow();
});


	$('.btn-success').click(function(){
		var panel = $(this).parents('.panel');
		var pId = panel.attr('id');
		panel.fadeOut();
		tasks[pId].state = true;
		console.log(tasks);
		Drow();
	});

$('#myTab li').click(Drow());


// storage.local = {};
