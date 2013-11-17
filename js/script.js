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

        ( function callee() {
            self.timeoutId = setTimeout( function () {
                self._save( 'local' );
                callee();
            }, self._duration );
        })();

        window.addEventListener( 'beforeunload', function () {
            self._save( 'local' );
        });
    },
    timeoutId: null,
    local: {},

};

var storage = new ObjectStorage;
var tasks = new Object();
var subTid = 0;
var d = new Date(); 
var date = (d.getFullYear() - 2000);
if(storage.local.t1){
	tasks = storage.local;
}else{
		tasks["t0"] = {
		                        date : date.getDate().getMonth(),
		                        name : "Создать новые задачи",
		                        id : 0,
		                        state : false,
		                        subtasks : {}
		                      }; 
	}
var tId = 0;
Drow();
function Drow(){
	console.log(tId); 
	$('.panel-group').empty();
	var html = "";
	for(var i in tasks){
		html+= '<div class="panel panel-default" id = "t'+tasks[i].id+'">';
		html+= '<div class="panel-heading row">';
		html+= '<h4 class="panel-title col-lg-8">';
		html+= '<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+tasks[i].id+'" class="collapsed">'+tasks[i].name+'</a><span class="tdate pull-right">('+tasks[i].date+')</span>';
		html+= '</h4>';
		html+= '<div class="task_control pull-right col-lg-4">';
		html+= '<button  type="button" class="btn btn-success"><span class="glyphicon glyphicon-ok glyphicon-white"></span></button>';
		html+= '</div>';
		html+= '</div>';
		if(!$.isEmptyObject(tasks[i].subtasks)){
			html+= '<div id="collapse'+tasks[i].id+'" class="panel-collapse collapse"><div class="panel-body"><ul>';
			for(var j in tasks[i].subtasks){
				html+= '<li>'+tasks[i].subtasks[j]+'</li>';
			}
			html+= '</ul></div>';
		}
		html+= '</div>';
		html+= '</div>'; 
		if(tasks[i].state === true){
			$('#compliteTasks .panel-group').append(html);
		}
		else{
			$('#newTasks .panel-group').append(html);
		}  
		html = "";     
	}     
	controls();
}
$('#taskNameAdd').bind('change click keyup',function(){
	if($('#taskNameAdd').val().length > 0){
		$('#addButton').removeAttr("disabled");
	}
	else{
		$('#addButton').attr("disabled","disabled");
	}
});
$('#taskName').bind('change click keyup',function(){
	if($('#taskName').val().length > 0){
		$('.modal-footer button').removeAttr("disabled");
	}
	else{
		$('.modal-footer button').attr("disabled","disabled");
	}
});
$('#subTaskNameAdd').bind('change click keyup',function(){
	if($('#subTaskNameAdd').val().length > 0){
		$('#addSubButton').removeAttr("disabled");
	}
	else{
		$('#addSubButton').attr("disabled","disabled");
	}
});
function DrowModal(){
	$('.modal-body ul').append("<li id = '"+subTid+"'>"+tasks["t"+(tId-1)].subtasks[subTid]+"</li>");
	console.log(tasks["t"+(tId-1)].subtasks);
		subTid+=1;
}
function addTask(){
    tasks["t"+tId] = {
                        date : d.getDate()+ ".0" + (d.getMonth() + 1) + "." + Math.round(date) + ".г",
                        name : $('#taskNameAdd').val(),
                        id : tId,
                        state : false,
                        subtasks : {}
                      };    
    
    storage.local = tasks;
    for(var i in tasks){
    	tId = tasks[i].id+1;
    }  
    Drow();
}
$('#addButton').on('click',function(){
	addTask();
	if($('form .checkbox input').prop('checked')){
		$('#task_settings form #taskName').val($('#taskNameAdd').val());
		$('#task_settings').fadeIn();
	}
	else{
		$('#taskNameAdd').val("");
	}
});
$('#addSubButton').on('click',function(){
	tasks["t"+(tId-1)].subtasks[subTid] = $('#subTaskNameAdd').val();
	
	$('#subTaskNameAdd').val("")
	DrowModal();

});
function controls(){
	$('.btn-success').on('click', function(){
		var panel = $(this).parents('.panel');
		var pId = panel.attr('id');
		panel.fadeOut();
		tasks[pId].state = true;
		Drow();
	});
}
$('.modal-footer button').on('click',function(){
	tasks["t"+(tId-1)].name = $('#task_settings form #taskName').val();
	$('#taskNameAdd').val(" ");
	$('#task_settings').fadeOut();
	console.log(tasks["t"+(tId-1)]);
	Drow();
	subTid = 0;
});
$('.content_wrapper').css('padding-bottom',$('footer').height());
// storage.local = {};
