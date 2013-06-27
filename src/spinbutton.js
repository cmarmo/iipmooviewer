/*
   spinbutton.js
license: MIT-style license
authors:
- Christian Merz (original spinbutton.js)
- Emmanuel Bertin (present modified version)
requires:
- Mootools-core:1.3.2/Element.Event
provides: [spinbutton]
*/
var Spinbutton = new Class({
    Implements: [Options, Events],
    
    options: {
        classPrefix: 'SpinButton',
        start: 10.0,
        min: 0,
        max: 100,
        stepsize: 1.0,
        incrementalStep: 10.0,
        accelFactor: 2.0,
        accelCount: 50,
        spinbutton: null,
        watcherTime: 600,
        stepTime: 300,
        minStepperSize: 30,
        threshold: 25,
        onchange: function(value){}
    },
    initialize: function(options){

        this.setOptions(options);
        if (!this.options.spinbutton) {
            return;
        }
        this.currentValue = this.options.start;
        this.options.spinbutton.addClass(this.options.classPrefix + 'Input')
        var container = new Element('div', {
            'class': this.options.classPrefix + 'Container'
        }).wraps(this.options.spinbutton);

        this.options.spinbutton.setProperties({
            'value': this.currentValue,
            'role': 'spinbutton',
            'tabindex': '0',
        });
        this.up = new Element('div', {
            'class': this.options.classPrefix + 'Up',
            'html': '&uarr;'
        }).inject(this.options.spinbutton, 'after');
        this.down = new Element('div', {
            'class': this.options.classPrefix + 'Down',
            'html': '&darr;'
        }).inject(this.options.spinbutton, 'after');
        this.resetAccel();
        this.initEvents();
        this.umousedflag = this.dmousedflag = false;
    },

    resetAccel: function(){
        this.currentAccelFactor = 1.0;
        this.currentAccelCount = this.options.accelCount;
    },

    increase: function(step){
        this.checkCurrentValue();
        if (!step) 
            var stepsize = this.options.stepsize
        else 
            var stepsize = step;
        this.currentValue = (parseFloat(this.currentValue)
		+ stepsize*this.currentAccelFactor).toPrecision(6);
        if (--this.currentAccelCount == 0)
          {
          this.currentAccelFactor *= this.options.accelFactor;
          this.currentAccelCount = this.options.accelCount;
          }
        if (this.currentValue > this.options.max) 
            this.currentValue = this.options.max;
        this.setValue();
    },

    decrease: function(step){
        this.checkCurrentValue();
        if (!step) 
            var stepsize = this.options.stepsize
        else 
            var stepsize = step;
        this.currentValue = (parseFloat(this.currentValue)
		- stepsize*this.currentAccelFactor).toPrecision(6);
        if (--this.currentAccelCount == 0)
          {
          this.currentAccelFactor *= this.options.accelFactor;
          this.currentAccelCount = this.options.accelCount;
          }
        if (this.currentValue < this.options.min) 
            this.currentValue = this.options.min;
        this.setValue();
    },

    checkCurrentValue: function(){
        this.currentValue = this.options.spinbutton.getProperty('value');
        if (!this.currentValue) 
            this.currentValue = 0
    },

    setValue: function(){
        this.options.spinbutton.setProperties({
            'value': this.currentValue,
            'valuenow': this.currentValue,
        });
    },

    initEvents: function(){
        var self = this;
        self.options.spinbutton.addEvent('keydown', function(e){
            switch (e.key) {
                case 'up':
                    e.stop();
                    self.increase();
                    break;
                case 'down':
                    e.stop();
                    self.decrease();
                    break;
                case 'home':
                    e.stop();
                    self.currentValue = self.options.max;
                    self.setValue();
                    break;
                case 'end':
                    e.stop();
                    self.currentValue = self.options.min;
                    self.setValue();
                    break;
                case 'pageup':
                    e.stop();
                    self.increase(self.options.incrementalStep);
                    break;
                case 'pagedown':
                    e.stop();
                    self.decrease(self.options.incrementalStep);
                    break;
            }
        });
        self.options.spinbutton.addEvent('keyup', function(e){
            switch (e.key) {
                case 'up':
                case 'down':
                    self.resetAccel();
                    self.options.onchange(self.currentValue);
                    break;
            }
        });
        var automaticIncrease = function(){
            self.increase();
        };
        var automaticDecrease = function(){
            self.decrease();
        };
        self.up.addEvents({
            'mousedown': function(e){
                var stepper = self.options.stepTime
                self.increase();
                self.umousedflag = true;
                self.timer = automaticIncrease.periodical(stepper);
                self.watcher = function(){
                    if (stepper > self.options.minStepperSize) {
                        stepper = parseInt(stepper / (self.options.stepTime / (stepper - self.options.threshold)));
                        if (stepper > self.options.minStepperSize) {
                            clearInterval(self.timer);
                            self.timer = automaticIncrease.periodical(stepper);
                        }
                        else {
                            stepper = self.options.minStepperSize;
                            clearInterval(self.timer);
                            self.timer = automaticIncrease.periodical(stepper);
                        }
                    }
                    else {
                        clearInterval(self.watcher);
                    }
                }.periodical(self.options.watcherTime);
            },
            'mouseup': function(e){
                clearInterval(self.watcher);
                clearInterval(self.timer);
                self.resetAccel();
                self.options.onchange(self.currentValue);
            },
            'mouseout': function(e){
                if (self.umousedflag) {
                    clearInterval(self.watcher);
                    clearInterval(self.timer);
                    self.resetAccel();
                    self.options.onchange(self.currentValue);
                    self.umousedflag = false;
                }
            }
        });
        self.down.addEvents({
            'mousedown': function(e){
                var stepper = self.options.stepTime;
                self.decrease();
                self.dmousedflag = true;
                self.timer = automaticDecrease.periodical(stepper);
                self.watcher = function(){
                    if (stepper > self.options.minStepperSize) {
                        stepper = parseInt(stepper / (self.options.stepTime / (stepper - self.options.threshold)));
                        if (stepper > self.options.minStepperSize) {
                            clearInterval(self.timer);
                            self.timer = automaticDecrease.periodical(stepper);
                        }
                        else {
                            stepper = self.options.minStepperSize;
                            clearInterval(self.timer);
                            self.timer = automaticDecrease.periodical(stepper);
                        }
                    }
                    else {
                    
                        clearInterval(self.watcher);
                    }
                }.periodical(self.options.watcherTime);
            },
            'mouseup': function(e){
                clearInterval(self.watcher);
                clearInterval(self.timer);
                self.resetAccel();
                self.options.onchange(self.currentValue);
            },
            'mouseout': function(e){
                if (self.dmousedflag) {
                    clearInterval(self.watcher);
                    clearInterval(self.timer);
                    self.resetAccel();
                    self.options.onchange(self.currentValue);
                    self.dmousedflag = false;
                }
            }
        });
        self.options.spinbutton.addEvent('change', function(){
          self.options.onchange( self.options.spinbutton.getProperty('value'));
        });
    }
});

