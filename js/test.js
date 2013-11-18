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
var task = new Object();

console.log(tasks);
var tlength = 0;
task = {
    date : new Date(),
    name : "task name",
    id : 0,
    state : false
};


// console.log(tlength);
Drow();
function Drow(){
    tasks = storage.local;
    // for(var i in tasks){
    //     tlength = tasks[i].id;
    // }    
    // task.id =  tlength;
    $('.panel-group').empty();
    var html = "";
    var taskStatus = "#newTasks";
    for(var i in tasks){
        if(tasks[i].state == true){
            taskStatus = "#compliteTasks";
        }
        else{
            taskStatus = "#newTasks";
        }
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
    $(taskStatus+' .panel-group').html(html);
    html = "";
}

$('#addButton').click(function(){
    tasks["t"+task.id] = task;
    tasks["t"+task.id].name = $('#taskNameAdd').val();
    tasks["t"+task.id].date = new Date();
    tasks["t"+task.id].id = task.id;
    tasks["t"+task.id].state = false;
    task.id += 1;
    $('#taskNameAdd').val(" ");
    console.log("t"+task.id+"="+tasks['t'+task.id].id);
    storage.local = tasks;
    Drow();
});
// storage.local = {};
