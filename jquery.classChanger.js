/*
* jQuery class changer plug-in 1.0
*
* Copyright (c) 2006 - 2010 Digital Evolution Group
*
*/
;(function ($, window, document, undefined) {

  var pluginName = 'classChanger',
    defaults = {
      'levels'       : 4,
      'addTo'        : 'body',
      'targetPrefix' : 'classChangerTarget',
      'buttonPrefix' : 'classChangerBtn',
      'buttonText'   : 'A'
    };

  function Plugin( element, options ) {
      this.element = element;
      this.options = $.extend( {}, defaults, options) ;      
      this._defaults = defaults;
      this._name = pluginName;
      this._cookiePrefix = "__" + this.options.targetPrefix;
      this._cookieVal;
      this.buttons = [];
      this.index = 0;
      this.init();
      if ( this.options.setActive )
        this.setActive(this.options.setActive)
  }

  Plugin.prototype.init = function () {
      
      var cfg = this.options;
      var buttons = this.buttons;

      if ($.cookie) 
        this._cookieVal = $.cookie(this._cookiePrefix, undefined);

      var buttonClick = function(event) {
        
        var activeTargetClass = cfg.targetPrefix + (event.data.idx + 1);
        var removeActiveClass = function (i, el) {
            $(el).removeClass(cfg.buttonPrefix + '_active');
        };

        $(buttons).each(removeActiveClass);

        $(cfg.addTo).removeClass(function () {
            return $.map(buttons, function (el) {
                return el.data('activePrefix');
            }).join(' ');
        });

        $(cfg.addTo).addClass(activeTargetClass);
        this.index = event.data.idx;

        if ( $.cookie ) 
            $.cookie(cookiePrefix, event.data.idx.toString(), { expires: 1, path: "/" });
        
        $(this)
          .addClass(cfg.buttonPrefix + '_active')
          .data('activePrefix', activeTargetClass);

        if ( cfg.onSetActive ) 
          cfg.onSetActive(this.index);
      };

      for (var i = 0; i < cfg.levels; i++) {
        var buttonText = ( typeof cfg.buttonText == 'object' )
                          ? cfg.buttonText[i] || cfg.buttonText[0]
                          : cfg.buttonText;

        var $button = $('<a>' + buttonText + '</a>');

        $button
            .attr('href', 'javascript:void(0)')
            .addClass(cfg.buttonPrefix + ' ' + cfg.buttonPrefix + (i + 1))                    
            .bind('click', { idx: i }, buttonClick);

        if (this._cookieVal == i) 
          $button.click();
        
        buttons.push($button);                
        $(this.element).append($button);
      }
  };

  Plugin.prototype.setActive = function(idx) {
    if ( this.buttons[idx - 1] ) 
      this.buttons[idx - 1].click();
  };

  Plugin.prototype.getActive = function() {
    return this.index;
  };

  $.fn[pluginName] = function(options) {    
    var instance = $(this).data(pluginName);    
    if ( typeof options == 'string') {      
      var args = Array.prototype.slice.call(arguments, 1);
      if ( instance[options] ) return instance[options].apply(instance, args);      
    } else {
      return this.each(function() {
        if (undefined == instance)
          $(this).data(pluginName, new Plugin(this, options));
      });
    }
    return;
  }

})(jQuery, window, document);