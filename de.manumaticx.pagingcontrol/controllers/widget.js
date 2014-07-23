var args = _.defaults(arguments[0] || {}, {
    indicatorColor: "#000",
    height: 5,
    width: Ti.UI.FILL,
    bottom: 0
});

// apply properties of Ti.UI.View that can be applied to paging control view
[
    "backgroundColor",
    "backgroundImage",
    "backgroundLeftCap",
    "backgroundRepeat",
    "backgroundTopCap",
    "borderRadius",
    "borderWidth",
    "bottom",
    "height",
    "horizontalWrap",
    "left",
    "opacity",
    "right",
    "top",
    "visible",
    "width",
    "zIndex"
].forEach(function(prop){ _.has(args, prop) && ($.pagingcontrol[prop] = args[prop]); });

// try to find scrollable view as child of parent
// this should work, if pagingcontrol is scrollable view have the same parent
// otherwise you can pass it with args or setScrollableView
if (args.__parentSymbol){
    args.__parentSymbol.children.length > 0 && 
    ($.scrollableView = _.find(args.__parentSymbol.children, function(child){
        return child.apiName === "Ti.UI.ScrollableView";
    }));
}

// assign passed reference of scrollable view
(_.has(args, "scrollableView")) && ($.scrollableView = args.scrollableView);

if ($.scrollableView){
    initWhenReady();
}

/**
 * calls init if we have all infos
 */
function initWhenReady(){
    // wait for postlayout event to get the pagingcontrol size 
    $.pagingcontrol.addEventListener('postlayout', function onPostLayout(){
        
        // if we have a scrollableView reference, initialize the paging control
        init();
        
        // remove eventlistener
        $.pagingcontrol.removeEventListener('postlayout', onPostLayout);
    });
}

/**
 * initialization method
 */
function init(){
    
    // save the indicator width as it's used in scroll event
    $.iWidth = Math.floor($.pagingcontrol.size.width / $.scrollableView.views.length);
    
    // create the indicator view
    $.indicator = Ti.UI.createView({
        backgroundColor: args.indicatorColor,
        height: $.pagingcontrol.getHeight(),
        width: $.iWidth,
        left: 0
    });
    
    // add the indicator
    $.pagingcontrol.add($.indicator);
    
    // add scroll listener to scrollable view
    $.scrollableView.addEventListener('scroll', onScroll);
}

/**
 * Callback for scroll event
 */
function onScroll(e){
    // here is where the magic happens, as simple as that
    $.indicator.setLeft(e.currentPageAsFloat * $.iWidth);    
}

/**
 * if you need to set it in the controller
 * @param {Ti.UI.Scrollableview} scrollable view
 */
exports.setScrollableView = function(_sv){
    $.scrollableView = _sv;
    initWhenReady();
};