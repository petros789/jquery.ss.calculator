(function ($, undefined) {

    // Contains all the buttons
    var buttons = [
        { label: 'MR' },
        { label: 'MS' },
        { label: 'MC' },
        { label: 'Clear', classname: 'ss-calculator-clear ss-calculator-clearfix', action: 'clear' },
        { label: 'CE', action: 'clearEntry' },
        { label: '*', classname: 'ss-calculator-multiply', action: 'operator' },
        { label: 7, classname: 'ss-calculator-clearfix', action: 'number' },
        { label: 8, action: 'number' },
        { label: 9, action: 'number' },
        { label: '+', classname: 'ss-calculator-plus', action: 'operator' },
        { label: 4, classname: 'ss-calculator-clearfix', action: 'number' },
        { label: 5, action: 'number' },
        { label: 6, action: 'number' },
        { label: '-', classname: 'ss-calculator-minus', action: 'operator' },
        { label: 1, classname: 'ss-calculator-clearfix', action: 'number' },
        { label: 2, action: 'number' },
        { label: 3, action: 'number' },
        { label: '/', classname: 'ss-calculator-divide', action: 'operator' },
        { label: 0, classname: 'ss-calculator-clearfix ss-calculator-wide', action: 'number' },
        { label: '.', classname: 'ss-calculator-dot', action: 'dot' },
        { label: '=', classname: 'ss-calculator-equals', action: 'equals' }
    ];

    // Defines the widget
    $.widget('ss.calculator', {

        version: '0.0.1',

        // configurable options
        options: {
            buttons: buttons,
            show: false,
            hide: false,
            showOnCreate: true
        },

        // Calls at the time of creation
        _create : function() {
            this.element.addClass('ss-calculator');
            this._createWrapper();
            this._createButtons();
            this._renderMarkup();

            this._on({
                'click button': this._clickHandler
            });

            this.currentDisplay = [];
            this.display = [];
            this.numericalInput = false;
        },

        // Creates the wrapper
        _createWrapper: function() {
            var el = $('<div/>'), display;
            this.shell = el.clone().addClass('ss-calculator-shell');
            display = el.clone().addClass('ss-calculator-display').appendTo(this.shell);
            el.clone().addClass('ss-calculator-calculation').appendTo(display);
            el.clone().text('0').addClass('ss-calculator-result').appendTo(display);
            if(!this.options.showOnCreate) {
                this._hide(this.element, this.options.hide)
            }
        },

        // loads the buttons
        _createButtons: function() {
            var el = $('<button/>'), container = $('<div/>').addClass('ui-helper-clearfix'), widget = this, i;

            // iterates on the buttons array
            $.each(this.options.buttons, function(i, button) {
                if(widget._trigger('beforeAddButtons', null, button)) {
                    var btn = el.clone().text(button.label).appendTo(container).button();

                    if(!!button.classname) {
                        btn.addClass(button.classname);
                    }

                    if(typeof button.action === 'string') {
                        btn.data('action', button.action);
                    }
                    else if(typeof button.action === 'function') {
                        var fName = 'custom.ss.' + i; 
                        widget['_' + fName] = button.action;
                        button.data('action', fName);
                    }
                }
            });

            // updates shell
            container.appendTo(this.shell);
        },

        // Joins everything together
        _renderMarkup: function() {
            this.shell.appendTo(this.element);
        },

        _setOptions: function(options) {
            this._superApply(arguments);
        },

        _setOption: function(key, val) {
            this._super(key, val);

            if(key === 'buttons') {
                this.shell.find('button').remove();
                this._createButtons;
                this._renderMarkup;
            }
            else if(key === 'disable') {
                this.shell.find('button').button('option', key, val);
            }
        }, 

        show: function() {
            this._show(this.element, this.options.show);
        },

        _clickHandler: function(e) {
            var btn = $(e.target).closest('button'), fn = btn.data('action');

            this['_' + fn](e, btn);
        },

        _clear: function(e, ui) {
            this.currentDisplay = [];
            this.display = [];
            this._updateDisplay();
            this._display();
            this.numericalInput = false;
        }, 

        _clearEntry: function(e, ui) {
            console.log('clearEntry');
        }, 

        _equals: function(e, ui) {
            console.log('equals');
        }, 

        _operator: function(e, ui) {

            if(!this.display.length && !this.currentDisplay.length) {
                this.currentDisplay.push(this.element.find('.ss-calculator-result').text());
            }
            else if(this.currentDisplay.slice(0).reverse()[0] === '.') {
                this.currentDisplay.pop();
            }

            if(!this.display.length || this.numericalInput) {
                this.display.push([this.currentDisplay.join(''), ' ', ui.text(), ' '].join(''))
            }
            else if(!this.numericalInput) {
                var length = this.display.length, str = this.display[length - 1].replace(/[\*\/\+\-]/, ui.text());
                this.display.pop();
                this.display.push(str);
            }

            this._display();
            this.numericalInput = false;
        }, 

        _number: function(e, ui) {
            this.currentDisplay.push(ui.text());
            this._updateDisplay();
            this.numericalInput = true;
        }, 

        _dot: function(e, ui) {
            var dot = false, x = this.currentDisplay.length;

            if(!x) {
                this.currentDisplay.push('0');
            }

            while( --x) {
                if(this.currentDisplay[x] === '.') {
                    dot = true;
                    break;
                }
            }

            if(dot) {
                return false;
            }
            else {
                this.currentDisplay.push('.');
                this._updateDisplay();
            }
        },

        _updateDisplay: function() {
            if(!this.currentDisplay.length) {
                this.element.find('.ss-calculator-result').text('0');
            }
            else if(this.currentDisplay.length < 18) {
                this.element.find('.ss-calculator-result').text(this.currentDisplay.join(''));
            }
        },

        _display: function() {
            this.element.find('.ss-calculator-calculation').text(this.display.join(''));
            this.currentDisplay = [];
        }




    });

}(jQuery));
