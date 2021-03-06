function MainAssistant()
{
    // subtitle random list
    this.randomSub = 
	[
	 {weight: 30, text: $L('Presented by WebOS Internals')},
	 ];
	
    // setup list model
    this.mainModel = {items:[]};
	
    // setup menu
    this.menuModel = {
	visible: true,
	items: [ {
		label: $L("Preferences"),
		command: 'do-prefs'
	    }, {
		label: $L("Help"),
		command: 'do-help'
	    } ]
    };
};

MainAssistant.prototype.setup = function()
{
	
    // set theme because this can be the first scene pushed
    this.controller.document.body.className = prefs.get().theme;
	
    this.controller.get('main-title').innerHTML = $L('Secure Shell');
    this.controller.get('version').innerHTML = $L('v0.0.0');
    this.controller.get('subTitle').innerHTML = $L('Presented by WebOS Internals');	

    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
    // get elements
    this.versionElement =	this.controller.get('version');
    this.subTitleElement =	this.controller.get('subTitle');
    this.listElement =		this.controller.get('mainList');
	
    this.versionElement.innerHTML = "v" + Mojo.Controller.appInfo.version;
    this.subTitleElement.innerHTML = this.getRandomSubTitle();

    this.mainModel.items = [ {
	    name:	$L("Browser Shell"),
	    type:	'browser',
	    url:	'http://localhost:4200/',
	}, {
	    name:	$L("Embedded Shell"),
	    type:	'embedded',
	    url:	'http://localhost:4200/',
	}];

    this.controller.setupWidget('mainList', {
	    itemTemplate: "main/rowTemplate", swipeToDelete: false, reorderable: false },
	this.mainModel);
    this.listTapHandler = this.listTap.bindAsEventListener(this);
    this.controller.listen(this.listElement, Mojo.Event.listTap, this.listTapHandler);
};

MainAssistant.prototype.listTap = function(event)
{
    if (event.item.type == 'browser') {
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'open',
		parameters: {
		    id: 'com.palm.app.browser',
		    params: { target: event.item.url }
		}
	    });
    }
    if (event.item.type == 'embedded') {
	shell.newScene(this, event.item.url, prefs.get().popShells);
    }
};

MainAssistant.prototype.getRandomSubTitle = function()
{
    // loop to get total weight value
    var weight = 0;
    for (var r = 0; r < this.randomSub.length; r++) {
	weight += this.randomSub[r].weight;
    }
	
    // random weighted value
    var rand = Math.floor(Math.random() * weight);
    //alert('rand: ' + rand + ' of ' + weight);
	
    // loop through to find the random title
    for (var r = 0; r < this.randomSub.length; r++) {
	if (rand <= this.randomSub[r].weight) {
	    return this.randomSub[r].text;
	}
	else {
	    rand -= this.randomSub[r].weight;
	}
    }
	
    // if no random title was found (for whatever reason, wtf?) return first and best subtitle
    return this.randomSub[0].text;
};


MainAssistant.prototype.errorMessage = function(msg)
{
    this.controller.showAlertDialog(
{
    allowHTMLMessage:	true,
    preventCancel:	true,
    title:		'Secure Shell',
    message:		msg,
    choices:		[{label:$L("Ok"), value:'ok'}],
    onChoose:		function(e){}
});
};

MainAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command) {
	switch (event.command) {
	case 'do-prefs':
	this.controller.stageController.pushScene('preferences');
	break;
	case 'do-help':
	this.controller.stageController.pushScene('help');
	break;
	}
    }
};

MainAssistant.prototype.activate = function(event)
{
    if (this.alreadyActivated) {
    }
	
    if (this.controller.stageController.setWindowOrientation) {
	this.controller.stageController.setWindowOrientation("up");
    }
	
    this.alreadyActivated = true;
};

MainAssistant.prototype.deactivate = function(event)
{
};

MainAssistant.prototype.cleanup = function(event)
{
};
