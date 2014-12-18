var opts = {};

init(arguments[0] || {});

function getTabWidth(length) {
	var orientation = Ti.Gesture.orientation;
	var displayWidth = OS_ANDROID ? Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor : Ti.Platform.displayCaps.platformWidth;
	
	var tabWidth = $.expand ? (displayWidth / length) - 1 : getDefaultTabWidth(displayWidth, orientation);
	
	return tabWidth > 100 ? tabWidth : 100;
}

function getDefaultTabWidth(displayWidth, orientation) {
	return orientation == Ti.UI.LANDSCAPE_LEFT || orientation == Ti.UI.LANDSCAPE_RIGHT ? Math.floor(displayWidth / 7) : Math.floor(displayWidth / 4);
}

function onOrientationChange(e) {
	var tabs = $.tabs.getChildren();
	var newWidth = getTabWidth((tabs.length + 1) / 2);

	if (newWidth != $.tabWidth) {
		$.tabWidth = newWidth;
		_.each(tabs, function(tab) {
			if (tab.isTab)
				tab.setWidth(newWidth);
		});
	}

	$.tabs.setWidth(getWidth());
}

function init(args) {
	_.defaults(opts, args);

	$.expand = args.expand;

	$.tabWidth = args.tabs.width || getTabWidth(args.titles.length);

	$.tabs.applyProperties({
		width : getWidth(),
		height : Ti.UI.FILL
	});
	
	args.rtl ? $.tabs.setRight(0) : $.tabs.setLeft(0);
	
	for ( i = 0; i < args.titles.length; i++) {
		var t = Ti.UI.createView({
			width : $.tabWidth,
			height : Ti.UI.FILL,
		});

		var container = Ti.UI.createView({
			layout : "horizontal",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		});

		t.add(container);

		var label = Ti.UI.createLabel({
			color : "#000",
			text : args.titles[i]
		});
		
		var icon = Ti.UI.createImageView({
			width : 19,
			height : 19,
			image : args.icons[i]
		});
		
		if (args.rtl) {
			icon.setLeft(3);
			args.titles[i] && container.add(label);
			args.icons[i] && container.add(icon);
		} else {
			label.setLeft(3);
			args.icons[i] && container.add(icon);
			args.titles[i] && container.add(label);
		}

		t.isTab = true;

		(function(index) {
			t.addEventListener('click', function() {
				var view = this;
				$.trigger('select', {
					tab : index,
					view : view
				});
			});
		})(i);

		$.tabs.add(t);

		if (i < args.titles.length - 1) {
			// add divider
			$.tabs.add(Ti.UI.createView({
				backgroundColor : args.tabs.dividerColor,
				height : 32,
				width : 1
			}));
		}
	}
}

function getWidth() {
	return $.tabWidth * opts.titles.length + opts.titles.length;
};

exports.onOrientationChange = onOrientationChange;
exports.getWidth = getWidth;
