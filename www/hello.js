(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Object.observe && !Array.observe && (function(O, A) {
"use strict";

var notifier = O.getNotifier,
    perform = "performChange",
    original = "_original",
    type = "splice";

var wrappers = {
    push: function push(item) {
        var args = arguments,
            ret = push[original].apply(this, args);

        notifier(this)[perform](type, function() {
            return {
                index: ret - args.length,
                addedCount: args.length,
                removed: []
            };
        });

        return ret;
    },
    unshift: function unshift(item) {
        var args = arguments,
            ret = unshift[original].apply(this, args);

        notifier(this)[perform](type, function() {
            return {
                index: 0,
                addedCount: args.length,
                removed: []
            };
        });

        return ret;
    },
    pop: function pop() {
        var len = this.length,
            item = pop[original].call(this);

        if (this.length !== len)
            notifier(this)[perform](type, function() {
                return {
                    index: this.length,
                    addedCount: 0,
                    removed: [ item ]
                };
            }, this);

        return item;
    },
    shift: function shift() {
        var len = this.length,
            item = shift[original].call(this);

        if (this.length !== len)
            notifier(this)[perform](type, function() {
                return {
                    index: 0,
                    addedCount: 0,
                    removed: [ item ]
                };
            }, this);

        return item;
    },
    splice: function splice(start, deleteCount) {
        var args = arguments,
            removed = splice[original].apply(this, args);

        if (removed.length || args.length > 2)
            notifier(this)[perform](type, function() {
                return {
                    index: start,
                    addedCount: args.length - 2,
                    removed: removed
                };
            }, this);

        return removed;
    }
};

for (var wrapper in wrappers) {
    wrappers[wrapper][original] = A.prototype[wrapper];
    A.prototype[wrapper] = wrappers[wrapper];
}

A.observe = function(object, handler) {
    return O.observe(object, handler, [ "add", "update", "delete", type ]);
};
A.unobserve = O.unobserve;

})(Object, Array);

},{}],2:[function(require,module,exports){
(function (global){
/* eslint max-len: 0 */

"use strict";

require("core-js/shim");

require("babel-regenerator-runtime");

// Should be removed in the next major release:

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-regenerator-runtime":290,"core-js/fn/regexp/escape":3,"core-js/shim":289}],3:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
},{"../../modules/_core":23,"../../modules/core.regexp.escape":117}],4:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],5:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};
},{"./_cof":18}],6:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":39,"./_wks":114}],7:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],8:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":48}],9:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":104,"./_to-length":107,"./_to-object":108}],10:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":104,"./_to-length":107,"./_to-object":108}],11:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":36}],12:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":104,"./_to-iobject":106,"./_to-length":107}],13:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":15,"./_ctx":24,"./_iobject":44,"./_to-length":107,"./_to-object":108}],14:[function(require,module,exports){
var aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , IObject   = require('./_iobject')
  , toLength  = require('./_to-length');

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};
},{"./_a-function":4,"./_iobject":44,"./_to-length":107,"./_to-object":108}],15:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"./_is-array":46,"./_is-object":48,"./_wks":114}],16:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":4,"./_invoke":43,"./_is-object":48}],17:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":18,"./_wks":114}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],19:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , hide        = require('./_hide')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":7,"./_ctx":24,"./_defined":26,"./_descriptors":27,"./_for-of":36,"./_hide":39,"./_iter-define":52,"./_iter-step":54,"./_meta":61,"./_object-create":65,"./_object-dp":66,"./_redefine-all":85,"./_set-species":90}],20:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":11,"./_classof":17}],21:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":7,"./_an-object":8,"./_array-methods":13,"./_for-of":36,"./_has":38,"./_is-object":48,"./_meta":61,"./_redefine-all":85}],22:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":7,"./_export":31,"./_fails":33,"./_for-of":36,"./_global":37,"./_inherit-if-required":42,"./_is-object":48,"./_iter-detect":53,"./_meta":61,"./_redefine":86,"./_redefine-all":85,"./_set-to-string-tag":91}],23:[function(require,module,exports){
var core = module.exports = {version: '2.2.1'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],24:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":4}],25:[function(require,module,exports){
'use strict';
var anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive')
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
},{"./_an-object":8,"./_to-primitive":109}],26:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],27:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":33}],28:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":37,"./_is-object":48}],29:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],30:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":72,"./_object-keys":75,"./_object-pie":76}],31:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":23,"./_ctx":24,"./_global":37,"./_hide":39,"./_redefine":86}],32:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":114}],33:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],34:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":26,"./_fails":33,"./_hide":39,"./_redefine":86,"./_wks":114}],35:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":8}],36:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./_an-object":8,"./_ctx":24,"./_is-array-iter":45,"./_iter-call":50,"./_to-length":107,"./core.get-iterator-method":115}],37:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],38:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],39:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":27,"./_object-dp":66,"./_property-desc":84}],40:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":37}],41:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":27,"./_dom-create":28,"./_fails":33}],42:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":48,"./_set-proto":89}],43:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],44:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":18}],45:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":55,"./_wks":114}],46:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":18}],47:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":48}],48:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],49:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":18,"./_is-object":48,"./_wks":114}],50:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":8}],51:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":39,"./_object-create":65,"./_property-desc":84,"./_set-to-string-tag":91,"./_wks":114}],52:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":31,"./_has":38,"./_hide":39,"./_iter-create":51,"./_iterators":55,"./_library":57,"./_object-gpo":73,"./_redefine":86,"./_set-to-string-tag":91,"./_wks":114}],53:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":114}],54:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],55:[function(require,module,exports){
module.exports = {};
},{}],56:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":75,"./_to-iobject":106}],57:[function(require,module,exports){
module.exports = false;
},{}],58:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],59:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],60:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],61:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":33,"./_has":38,"./_is-object":48,"./_object-dp":66,"./_uid":113}],62:[function(require,module,exports){
var Map     = require('./es6.map')
  , $export = require('./_export')
  , shared  = require('./_shared')('metadata')
  , store   = shared.store || (shared.store = new (require('./es6.weak-map')));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};
},{"./_export":31,"./_shared":93,"./es6.map":147,"./es6.weak-map":253}],63:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, fn;
  if(isNode && (parent = process.domain))parent.exit();
  while(head){
    fn = head.fn;
    fn(); // <- currently we use it only for Promise - try / catch not required
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = true
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = !toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function(fn){
  var task = {fn: fn, next: undefined};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./_cof":18,"./_global":37,"./_task":103}],64:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":33,"./_iobject":44,"./_object-gops":72,"./_object-keys":75,"./_object-pie":76,"./_to-object":108}],65:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
},{"./_an-object":8,"./_dom-create":28,"./_enum-bug-keys":29,"./_html":40,"./_object-dps":67,"./_shared-key":92}],66:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":8,"./_descriptors":27,"./_ie8-dom-define":41,"./_to-primitive":109}],67:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":8,"./_descriptors":27,"./_object-dp":66,"./_object-keys":75}],68:[function(require,module,exports){
// Forced replacement prototype accessors methods
module.exports = require('./_library')|| !require('./_fails')(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete require('./_global')[K];
});
},{"./_fails":33,"./_global":37,"./_library":57}],69:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":27,"./_has":38,"./_ie8-dom-define":41,"./_object-pie":76,"./_property-desc":84,"./_to-iobject":106,"./_to-primitive":109}],70:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":71,"./_to-iobject":106}],71:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":29,"./_object-keys-internal":74}],72:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],73:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":38,"./_shared-key":92,"./_to-object":108}],74:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":12,"./_has":38,"./_shared-key":92,"./_to-iobject":106}],75:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":29,"./_object-keys-internal":74}],76:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],77:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":23,"./_export":31,"./_fails":33}],78:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":75,"./_object-pie":76,"./_to-iobject":106}],79:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":8,"./_global":37,"./_object-gopn":71,"./_object-gops":72}],80:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat
  , $trim       = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
},{"./_global":37,"./_string-trim":101,"./_string-ws":102}],81:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":37,"./_string-trim":101,"./_string-ws":102}],82:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":4,"./_invoke":43,"./_path":83}],83:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":37}],84:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],85:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":86}],86:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":23,"./_global":37,"./_has":38,"./_hide":39,"./_uid":113}],87:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],88:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],89:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":8,"./_ctx":24,"./_is-object":48,"./_object-gopd":69}],90:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":27,"./_global":37,"./_object-dp":66,"./_wks":114}],91:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":38,"./_object-dp":66,"./_wks":114}],92:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":93,"./_uid":113}],93:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":37}],94:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":4,"./_an-object":8,"./_wks":114}],95:[function(require,module,exports){
var fails = require('./_fails');

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};
},{"./_fails":33}],96:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":26,"./_to-integer":105}],97:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":26,"./_is-regexp":49}],98:[function(require,module,exports){
var $export = require('./_export')
  , fails   = require('./_fails')
  , defined = require('./_defined')
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
},{"./_defined":26,"./_export":31,"./_fails":33}],99:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":26,"./_string-repeat":100,"./_to-length":107}],100:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":26,"./_to-integer":105}],101:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":26,"./_export":31,"./_fails":33,"./_string-ws":102}],102:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],103:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":18,"./_ctx":24,"./_dom-create":28,"./_global":37,"./_html":40,"./_invoke":43}],104:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":105}],105:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],106:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":26,"./_iobject":44}],107:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":105}],108:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":26}],109:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":48}],110:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , isInteger           = require('./_is-integer')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , isIterable          = require('./core.is-iterable')
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":7,"./_array-copy-within":9,"./_array-fill":10,"./_array-includes":12,"./_array-methods":13,"./_classof":17,"./_ctx":24,"./_descriptors":27,"./_export":31,"./_fails":33,"./_global":37,"./_has":38,"./_hide":39,"./_is-array-iter":45,"./_is-integer":47,"./_is-object":48,"./_iter-detect":53,"./_iterators":55,"./_library":57,"./_object-create":65,"./_object-dp":66,"./_object-gopd":69,"./_object-gopn":71,"./_object-gpo":73,"./_property-desc":84,"./_redefine-all":85,"./_same-value":88,"./_set-species":90,"./_species-constructor":94,"./_to-index":104,"./_to-integer":105,"./_to-length":107,"./_to-object":108,"./_to-primitive":109,"./_typed":112,"./_typed-buffer":111,"./_uid":113,"./_wks":114,"./core.get-iterator-method":115,"./core.is-iterable":116,"./es6.array.iterator":128}],111:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , parseInt       = global.parseInt
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , min            = Math.min
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":7,"./_array-fill":10,"./_descriptors":27,"./_fails":33,"./_global":37,"./_hide":39,"./_library":57,"./_object-dp":66,"./_object-gopn":71,"./_redefine-all":85,"./_set-to-string-tag":91,"./_to-integer":105,"./_to-length":107,"./_typed":112}],112:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":37,"./_hide":39,"./_uid":113}],113:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],114:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';
module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};
},{"./_global":37,"./_shared":93,"./_uid":113}],115:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":17,"./_core":23,"./_iterators":55,"./_wks":114}],116:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./_classof":17,"./_core":23,"./_iterators":55,"./_wks":114}],117:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export')
  , $re     = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./_export":31,"./_replacer":87}],118:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":6,"./_array-copy-within":9,"./_export":31}],119:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $every  = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":31,"./_strict-method":95}],120:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":6,"./_array-fill":10,"./_export":31}],121:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":31,"./_strict-method":95}],122:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":31}],123:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":31}],124:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $forEach = require('./_array-methods')(0)
  , STRICT   = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":31,"./_strict-method":95}],125:[function(require,module,exports){
'use strict';
var ctx         = require('./_ctx')
  , $export     = require('./_export')
  , toObject    = require('./_to-object')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_ctx":24,"./_export":31,"./_is-array-iter":45,"./_iter-call":50,"./_iter-detect":53,"./_to-length":107,"./_to-object":108,"./core.get-iterator-method":115}],126:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $indexOf = require('./_array-includes')(false);

$export($export.P + $export.F * !require('./_strict-method')([].indexOf), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return $indexOf(this, searchElement, arguments[1]);
  }
});
},{"./_array-includes":12,"./_export":31,"./_strict-method":95}],127:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', {isArray: require('./_is-array')});
},{"./_export":31,"./_is-array":46}],128:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":6,"./_iter-define":52,"./_iter-step":54,"./_iterators":55,"./_to-iobject":106}],129:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
},{"./_export":31,"./_iobject":44,"./_strict-method":95,"./_to-iobject":106}],130:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toInteger = require('./_to-integer')
  , toLength  = require('./_to-length');

$export($export.P + $export.F * !require('./_strict-method')([].lastIndexOf), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index;
    return -1;
  }
});
},{"./_export":31,"./_strict-method":95,"./_to-integer":105,"./_to-iobject":106,"./_to-length":107}],131:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $map    = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":31,"./_strict-method":95}],132:[function(require,module,exports){
'use strict';
var $export = require('./_export');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)result[index] = arguments[index++];
    result.length = aLen;
    return result;
  }
});
},{"./_export":31,"./_fails":33}],133:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
},{"./_array-reduce":14,"./_export":31,"./_strict-method":95}],134:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
},{"./_array-reduce":14,"./_export":31,"./_strict-method":95}],135:[function(require,module,exports){
'use strict';
var $export    = require('./_export')
  , html       = require('./_html')
  , cof        = require('./_cof')
  , toIndex    = require('./_to-index')
  , toLength   = require('./_to-length')
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
},{"./_cof":18,"./_export":31,"./_fails":33,"./_html":40,"./_to-index":104,"./_to-length":107}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $some   = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":31,"./_strict-method":95}],137:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , fails     = require('./_fails')
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});
},{"./_a-function":4,"./_export":31,"./_fails":33,"./_strict-method":95,"./_to-object":108}],138:[function(require,module,exports){
require('./_set-species')('Array');
},{"./_set-species":90}],139:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});
},{"./_export":31}],140:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export')
  , fails   = require('./_fails')
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./_export":31,"./_fails":33}],141:[function(require,module,exports){
'use strict';
var $export     = require('./_export')
  , toObject    = require('./_to-object')
  , toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
},{"./_export":31,"./_fails":33,"./_to-object":108,"./_to-primitive":109}],142:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
},{"./_date-to-primitive":25,"./_hide":39,"./_wks":114}],143:[function(require,module,exports){
var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  require('./_redefine')(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
},{"./_redefine":86}],144:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', {bind: require('./_bind')});
},{"./_bind":16,"./_export":31}],145:[function(require,module,exports){
'use strict';
var isObject       = require('./_is-object')
  , getPrototypeOf = require('./_object-gpo')
  , HAS_INSTANCE   = require('./_wks')('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});
},{"./_is-object":48,"./_object-dp":66,"./_object-gpo":73,"./_wks":114}],146:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || dP(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./_descriptors":27,"./_has":38,"./_object-dp":66,"./_property-desc":84}],147:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":22,"./_collection-strong":19}],148:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":31,"./_math-log1p":59}],149:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$export($export.S, 'Math', {asinh: asinh});
},{"./_export":31}],150:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":31}],151:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":31,"./_math-sign":60}],152:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":31}],153:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":31}],154:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');

$export($export.S, 'Math', {expm1: require('./_math-expm1')});
},{"./_export":31,"./_math-expm1":58}],155:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":31,"./_math-sign":60}],156:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":31}],157:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":31,"./_fails":33}],158:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":31}],159:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":31,"./_math-log1p":59}],160:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":31}],161:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":31,"./_math-sign":60}],162:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":31,"./_fails":33,"./_math-expm1":58}],163:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":31,"./_math-expm1":58}],164:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":31}],165:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , has               = require('./_has')
  , cof               = require('./_cof')
  , inheritIfRequired = require('./_inherit-if-required')
  , toPrimitive       = require('./_to-primitive')
  , fails             = require('./_fails')
  , gOPN              = require('./_object-gopn').f
  , gOPD              = require('./_object-gopd').f
  , dP                = require('./_object-dp').f
  , $trim             = require('./_string-trim').trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(require('./_object-create')(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
},{"./_cof":18,"./_descriptors":27,"./_fails":33,"./_global":37,"./_has":38,"./_inherit-if-required":42,"./_object-create":65,"./_object-dp":66,"./_object-gopd":69,"./_object-gopn":71,"./_redefine":86,"./_string-trim":101,"./_to-primitive":109}],166:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":31}],167:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":31,"./_global":37}],168:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":31,"./_is-integer":47}],169:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":31}],170:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":31,"./_is-integer":47}],171:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":31}],172:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":31}],173:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
},{"./_export":31,"./_parse-float":80}],174:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":31,"./_parse-int":81}],175:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , anInstance   = require('./_an-instance')
  , toInteger    = require('./_to-integer')
  , aNumberValue = require('./_a-number-value')
  , repeat       = require('./_string-repeat')
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});
},{"./_a-number-value":5,"./_an-instance":7,"./_export":31,"./_fails":33,"./_string-repeat":100,"./_to-integer":105}],176:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $fails       = require('./_fails')
  , aNumberValue = require('./_a-number-value')
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});
},{"./_a-number-value":5,"./_export":31,"./_fails":33}],177:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":31,"./_object-assign":64}],178:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":31,"./_object-create":65}],179:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperties: require('./_object-dps')});
},{"./_descriptors":27,"./_export":31,"./_object-dps":67}],180:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":27,"./_export":31,"./_object-dp":66}],181:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":48,"./_meta":61,"./_object-sap":77}],182:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":69,"./_object-sap":77,"./_to-iobject":106}],183:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":70,"./_object-sap":77}],184:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":73,"./_object-sap":77,"./_to-object":108}],185:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./_is-object":48,"./_object-sap":77}],186:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./_is-object":48,"./_object-sap":77}],187:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./_is-object":48,"./_object-sap":77}],188:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":31,"./_same-value":88}],189:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":75,"./_object-sap":77,"./_to-object":108}],190:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
},{"./_is-object":48,"./_meta":61,"./_object-sap":77}],191:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
},{"./_is-object":48,"./_meta":61,"./_object-sap":77}],192:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":31,"./_set-proto":89}],193:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof')
  , test    = {};
test[require('./_wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./_redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./_classof":17,"./_redefine":86,"./_wks":114}],194:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
},{"./_export":31,"./_parse-float":80}],195:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});
},{"./_export":31,"./_parse-int":81}],196:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , anObject           = require('./_an-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , setProto           = require('./_set-proto').set
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":4,"./_an-instance":7,"./_an-object":8,"./_classof":17,"./_core":23,"./_ctx":24,"./_export":31,"./_for-of":36,"./_global":37,"./_is-object":48,"./_iter-detect":53,"./_library":57,"./_microtask":63,"./_redefine-all":85,"./_set-proto":89,"./_set-species":90,"./_set-to-string-tag":91,"./_species-constructor":94,"./_task":103,"./_wks":114}],197:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export')
  , _apply  = Function.apply;

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"./_export":31}],198:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export   = require('./_export')
  , create    = require('./_object-create')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , isObject  = require('./_is-object')
  , bind      = require('./_bind');

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":4,"./_an-object":8,"./_bind":16,"./_export":31,"./_fails":33,"./_is-object":48,"./_object-create":65}],199:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":8,"./_export":31,"./_fails":33,"./_object-dp":66,"./_to-primitive":109}],200:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":8,"./_export":31,"./_object-gopd":69}],201:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./_export')
  , anObject = require('./_an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./_an-object":8,"./_export":31,"./_iter-create":51}],202:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":8,"./_export":31,"./_object-gopd":69}],203:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":8,"./_export":31,"./_object-gpo":73}],204:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":8,"./_export":31,"./_has":38,"./_is-object":48,"./_object-gopd":69,"./_object-gpo":73}],205:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":31}],206:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":8,"./_export":31}],207:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":31,"./_own-keys":79}],208:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":8,"./_export":31}],209:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":31,"./_set-proto":89}],210:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":8,"./_export":31,"./_has":38,"./_is-object":48,"./_object-dp":66,"./_object-gopd":69,"./_object-gpo":73,"./_property-desc":84}],211:[function(require,module,exports){
var global            = require('./_global')
  , inheritIfRequired = require('./_inherit-if-required')
  , dP                = require('./_object-dp').f
  , gOPN              = require('./_object-gopn').f
  , isRegExp          = require('./_is-regexp')
  , $flags            = require('./_flags')
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function(){
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
},{"./_descriptors":27,"./_fails":33,"./_flags":35,"./_global":37,"./_inherit-if-required":42,"./_is-regexp":49,"./_object-dp":66,"./_object-gopn":71,"./_redefine":86,"./_set-species":90,"./_wks":114}],212:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":27,"./_flags":35,"./_object-dp":66}],213:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":34}],214:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":34}],215:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":34}],216:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":34,"./_is-regexp":49}],217:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject    = require('./_an-object')
  , $flags      = require('./_flags')
  , DESCRIPTORS = require('./_descriptors')
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}
},{"./_an-object":8,"./_descriptors":27,"./_fails":33,"./_flags":35,"./_redefine":86,"./es6.regexp.flags":212}],218:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":22,"./_collection-strong":19}],219:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});
},{"./_string-html":98}],220:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});
},{"./_string-html":98}],221:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});
},{"./_string-html":98}],222:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});
},{"./_string-html":98}],223:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":31,"./_string-at":96}],224:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":31,"./_fails-is-regexp":32,"./_string-context":97,"./_to-length":107}],225:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});
},{"./_string-html":98}],226:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});
},{"./_string-html":98}],227:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});
},{"./_string-html":98}],228:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":31,"./_to-index":104}],229:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":31,"./_fails-is-regexp":32,"./_string-context":97}],230:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});
},{"./_string-html":98}],231:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":52,"./_string-at":96}],232:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});
},{"./_string-html":98}],233:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":31,"./_to-iobject":106,"./_to-length":107}],234:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":31,"./_string-repeat":100}],235:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});
},{"./_string-html":98}],236:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":31,"./_fails-is-regexp":32,"./_string-context":97,"./_to-length":107}],237:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});
},{"./_string-html":98}],238:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});
},{"./_string-html":98}],239:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});
},{"./_string-html":98}],240:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./_string-trim":101}],241:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , core           = require('./_core')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = gOPD(it = toIObject(it), key = toPrimitive(key, true));
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , replacer, $replacer;
  while(arguments.length > i)args.push(arguments[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var BUGGY_JSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
for(var symbols = (
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; ){
  var key     = symbols[i++]
    , Wrapper = core.Symbol
    , sym     = wks(key);
  if(!(key in Wrapper))dP(Wrapper, key, {value: USE_NATIVE ? sym : wrap(sym)});
};

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
if(!QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild)setter = true;

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || BUGGY_JSON), 'JSON', {stringify: $stringify});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":8,"./_core":23,"./_descriptors":27,"./_enum-keys":30,"./_export":31,"./_fails":33,"./_global":37,"./_has":38,"./_hide":39,"./_is-array":46,"./_keyof":56,"./_library":57,"./_meta":61,"./_object-create":65,"./_object-dp":66,"./_object-gopd":69,"./_object-gopn":71,"./_object-gopn-ext":70,"./_object-gops":72,"./_object-pie":76,"./_property-desc":84,"./_redefine":86,"./_set-to-string-tag":91,"./_shared":93,"./_to-iobject":106,"./_to-primitive":109,"./_uid":113,"./_wks":114}],242:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , TYPED_ARRAY  = require('./_wks')('typed_array')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":8,"./_export":31,"./_fails":33,"./_global":37,"./_is-object":48,"./_set-species":90,"./_species-constructor":94,"./_to-index":104,"./_to-length":107,"./_typed":112,"./_typed-buffer":111,"./_wks":114}],243:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
},{"./_export":31,"./_typed":112,"./_typed-buffer":111}],244:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],245:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],246:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],247:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],248:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],249:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],250:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],251:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":110}],252:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":110}],253:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , has          = require('./_has')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":13,"./_collection":22,"./_collection-weak":21,"./_has":38,"./_is-object":48,"./_meta":61,"./_object-assign":64,"./_redefine":86}],254:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":22,"./_collection-weak":21}],255:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":6,"./_array-includes":12,"./_export":31}],256:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export')
  , cof     = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});
},{"./_cof":18,"./_export":31}],257:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":20,"./_export":31}],258:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
},{"./_export":31}],259:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
},{"./_export":31}],260:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
},{"./_export":31}],261:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
},{"./_export":31}],262:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":4,"./_descriptors":27,"./_export":31,"./_object-dp":66,"./_object-forced-pam":68,"./_to-object":108}],263:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":4,"./_descriptors":27,"./_export":31,"./_object-dp":66,"./_object-forced-pam":68,"./_to-object":108}],264:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":31,"./_object-to-array":78}],265:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export    = require('./_export')
  , ownKeys    = require('./_own-keys')
  , toIObject  = require('./_to-iobject')
  , createDesc = require('./_property-desc')
  , gOPD       = require('./_object-gopd')
  , dP         = require('./_object-dp');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)dP.f(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./_export":31,"./_object-dp":66,"./_object-gopd":69,"./_own-keys":79,"./_property-desc":84,"./_to-iobject":106}],266:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":27,"./_export":31,"./_object-forced-pam":68,"./_object-gopd":69,"./_object-gpo":73,"./_to-object":108,"./_to-primitive":109}],267:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":27,"./_export":31,"./_object-forced-pam":68,"./_object-gopd":69,"./_object-gpo":73,"./_to-object":108,"./_to-primitive":109}],268:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":31,"./_object-to-array":78}],269:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});
},{"./_an-object":8,"./_metadata":62}],270:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});
},{"./_an-object":8,"./_metadata":62}],271:[function(require,module,exports){
var Set                     = require('./es6.set')
  , from                    = require('./_array-from-iterable')
  , metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , getPrototypeOf          = require('./_object-gpo')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":8,"./_array-from-iterable":11,"./_metadata":62,"./_object-gpo":73,"./es6.set":218}],272:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":62,"./_object-gpo":73}],273:[function(require,module,exports){
var metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":8,"./_metadata":62}],274:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":62}],275:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":62,"./_object-gpo":73}],276:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":62}],277:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , aFunction                 = require('./_a-function')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});
},{"./_a-function":4,"./_an-object":8,"./_metadata":62}],278:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":20,"./_export":31}],279:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export')
  , $at     = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./_export":31,"./_string-at":96}],280:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = require('./_export')
  , defined     = require('./_defined')
  , toLength    = require('./_to-length')
  , isRegExp    = require('./_is-regexp')
  , getFlags    = require('./_flags')
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
},{"./_defined":26,"./_export":31,"./_flags":35,"./_is-regexp":49,"./_iter-create":51,"./_to-length":107}],281:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":31,"./_string-pad":99}],282:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":31,"./_string-pad":99}],283:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');
},{"./_string-trim":101}],284:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');
},{"./_string-trim":101}],285:[function(require,module,exports){
// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', {global: require('./_global')});
},{"./_export":31,"./_global":37}],286:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":37,"./_hide":39,"./_iterators":55,"./_redefine":86,"./_wks":114,"./es6.array.iterator":128}],287:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":31,"./_task":103}],288:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":31,"./_global":37,"./_invoke":43,"./_partial":82}],289:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');
},{"./modules/_core":23,"./modules/es6.array.copy-within":118,"./modules/es6.array.every":119,"./modules/es6.array.fill":120,"./modules/es6.array.filter":121,"./modules/es6.array.find":123,"./modules/es6.array.find-index":122,"./modules/es6.array.for-each":124,"./modules/es6.array.from":125,"./modules/es6.array.index-of":126,"./modules/es6.array.is-array":127,"./modules/es6.array.iterator":128,"./modules/es6.array.join":129,"./modules/es6.array.last-index-of":130,"./modules/es6.array.map":131,"./modules/es6.array.of":132,"./modules/es6.array.reduce":134,"./modules/es6.array.reduce-right":133,"./modules/es6.array.slice":135,"./modules/es6.array.some":136,"./modules/es6.array.sort":137,"./modules/es6.array.species":138,"./modules/es6.date.now":139,"./modules/es6.date.to-iso-string":140,"./modules/es6.date.to-json":141,"./modules/es6.date.to-primitive":142,"./modules/es6.date.to-string":143,"./modules/es6.function.bind":144,"./modules/es6.function.has-instance":145,"./modules/es6.function.name":146,"./modules/es6.map":147,"./modules/es6.math.acosh":148,"./modules/es6.math.asinh":149,"./modules/es6.math.atanh":150,"./modules/es6.math.cbrt":151,"./modules/es6.math.clz32":152,"./modules/es6.math.cosh":153,"./modules/es6.math.expm1":154,"./modules/es6.math.fround":155,"./modules/es6.math.hypot":156,"./modules/es6.math.imul":157,"./modules/es6.math.log10":158,"./modules/es6.math.log1p":159,"./modules/es6.math.log2":160,"./modules/es6.math.sign":161,"./modules/es6.math.sinh":162,"./modules/es6.math.tanh":163,"./modules/es6.math.trunc":164,"./modules/es6.number.constructor":165,"./modules/es6.number.epsilon":166,"./modules/es6.number.is-finite":167,"./modules/es6.number.is-integer":168,"./modules/es6.number.is-nan":169,"./modules/es6.number.is-safe-integer":170,"./modules/es6.number.max-safe-integer":171,"./modules/es6.number.min-safe-integer":172,"./modules/es6.number.parse-float":173,"./modules/es6.number.parse-int":174,"./modules/es6.number.to-fixed":175,"./modules/es6.number.to-precision":176,"./modules/es6.object.assign":177,"./modules/es6.object.create":178,"./modules/es6.object.define-properties":179,"./modules/es6.object.define-property":180,"./modules/es6.object.freeze":181,"./modules/es6.object.get-own-property-descriptor":182,"./modules/es6.object.get-own-property-names":183,"./modules/es6.object.get-prototype-of":184,"./modules/es6.object.is":188,"./modules/es6.object.is-extensible":185,"./modules/es6.object.is-frozen":186,"./modules/es6.object.is-sealed":187,"./modules/es6.object.keys":189,"./modules/es6.object.prevent-extensions":190,"./modules/es6.object.seal":191,"./modules/es6.object.set-prototype-of":192,"./modules/es6.object.to-string":193,"./modules/es6.parse-float":194,"./modules/es6.parse-int":195,"./modules/es6.promise":196,"./modules/es6.reflect.apply":197,"./modules/es6.reflect.construct":198,"./modules/es6.reflect.define-property":199,"./modules/es6.reflect.delete-property":200,"./modules/es6.reflect.enumerate":201,"./modules/es6.reflect.get":204,"./modules/es6.reflect.get-own-property-descriptor":202,"./modules/es6.reflect.get-prototype-of":203,"./modules/es6.reflect.has":205,"./modules/es6.reflect.is-extensible":206,"./modules/es6.reflect.own-keys":207,"./modules/es6.reflect.prevent-extensions":208,"./modules/es6.reflect.set":210,"./modules/es6.reflect.set-prototype-of":209,"./modules/es6.regexp.constructor":211,"./modules/es6.regexp.flags":212,"./modules/es6.regexp.match":213,"./modules/es6.regexp.replace":214,"./modules/es6.regexp.search":215,"./modules/es6.regexp.split":216,"./modules/es6.regexp.to-string":217,"./modules/es6.set":218,"./modules/es6.string.anchor":219,"./modules/es6.string.big":220,"./modules/es6.string.blink":221,"./modules/es6.string.bold":222,"./modules/es6.string.code-point-at":223,"./modules/es6.string.ends-with":224,"./modules/es6.string.fixed":225,"./modules/es6.string.fontcolor":226,"./modules/es6.string.fontsize":227,"./modules/es6.string.from-code-point":228,"./modules/es6.string.includes":229,"./modules/es6.string.italics":230,"./modules/es6.string.iterator":231,"./modules/es6.string.link":232,"./modules/es6.string.raw":233,"./modules/es6.string.repeat":234,"./modules/es6.string.small":235,"./modules/es6.string.starts-with":236,"./modules/es6.string.strike":237,"./modules/es6.string.sub":238,"./modules/es6.string.sup":239,"./modules/es6.string.trim":240,"./modules/es6.symbol":241,"./modules/es6.typed.array-buffer":242,"./modules/es6.typed.data-view":243,"./modules/es6.typed.float32-array":244,"./modules/es6.typed.float64-array":245,"./modules/es6.typed.int16-array":246,"./modules/es6.typed.int32-array":247,"./modules/es6.typed.int8-array":248,"./modules/es6.typed.uint16-array":249,"./modules/es6.typed.uint32-array":250,"./modules/es6.typed.uint8-array":251,"./modules/es6.typed.uint8-clamped-array":252,"./modules/es6.weak-map":253,"./modules/es6.weak-set":254,"./modules/es7.array.includes":255,"./modules/es7.error.is-error":256,"./modules/es7.map.to-json":257,"./modules/es7.math.iaddh":258,"./modules/es7.math.imulh":259,"./modules/es7.math.isubh":260,"./modules/es7.math.umulh":261,"./modules/es7.object.define-getter":262,"./modules/es7.object.define-setter":263,"./modules/es7.object.entries":264,"./modules/es7.object.get-own-property-descriptors":265,"./modules/es7.object.lookup-getter":266,"./modules/es7.object.lookup-setter":267,"./modules/es7.object.values":268,"./modules/es7.reflect.define-metadata":269,"./modules/es7.reflect.delete-metadata":270,"./modules/es7.reflect.get-metadata":272,"./modules/es7.reflect.get-metadata-keys":271,"./modules/es7.reflect.get-own-metadata":274,"./modules/es7.reflect.get-own-metadata-keys":273,"./modules/es7.reflect.has-metadata":275,"./modules/es7.reflect.has-own-metadata":276,"./modules/es7.reflect.metadata":277,"./modules/es7.set.to-json":278,"./modules/es7.string.at":279,"./modules/es7.string.match-all":280,"./modules/es7.string.pad-end":281,"./modules/es7.string.pad-start":282,"./modules/es7.string.trim-left":283,"./modules/es7.string.trim-right":284,"./modules/es7.system.global":285,"./modules/web.dom.iterable":286,"./modules/web.immediate":287,"./modules/web.timers":288}],290:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":294}],291:[function(require,module,exports){
var idbModules = {  // jshint ignore:line
    util: {
        cleanInterface: false
    }
};

(function () {
    'use strict';

    var testObject = {test: true};
    //Test whether Object.defineProperty really works.
    if (Object.defineProperty) {
        try {
            Object.defineProperty(testObject, 'test', { enumerable: false });
            if (testObject.test) {
                idbModules.util.cleanInterface = true;      // jshint ignore:line
            }
        } catch (e) {
        //Object.defineProperty does not work as intended.
        }
    }
})();

(function(idbModules) {
    'use strict';

    /**
     * A utility method to callback onsuccess, onerror, etc as soon as the calling function's context is over
     * @param {Object} fn
     * @param {Object} context
     * @param {Object} argArray
     */
    function callback(fn, context, event) {
        //window.setTimeout(function(){
        event.target = context;
        (typeof context[fn] === "function") && context[fn].apply(context, [event]);
        //}, 1);
    }

    /**
     * Shim the DOMStringList object.
     *
     */
    var StringList = function() {
        this.length = 0;
        this._items = [];
        //Internal functions on the prototype have been made non-enumerable below.
        if (idbModules.util.cleanInterface) {
            Object.defineProperty(this, '_items', {
                enumerable: false
            });
        }
    };
    StringList.prototype = {
        // Interface.
        contains: function(str) {
            return -1 !== this._items.indexOf(str);
        },
        item: function(key) {
            return this._items[key];
        },

        // Helpers. Should only be used internally.
        indexOf: function(str) {
            return this._items.indexOf(str);
        },
        push: function(item) {
            this._items.push(item);
            this.length += 1;
            for (var i = 0; i < this._items.length; i++) {
                this[i] = this._items[i];
            }
        },
        splice: function(/*index, howmany, item1, ..., itemX*/) {
            this._items.splice.apply(this._items, arguments);
            this.length = this._items.length;
            for (var i in this) {
                if (i === String(parseInt(i, 10))) {
                    delete this[i];
                }
            }
            for (i = 0; i < this._items.length; i++) {
                this[i] = this._items[i];
            }
        }
    };
    if (idbModules.util.cleanInterface) {
        for (var i in {
            'indexOf': false,
            'push': false,
            'splice': false
        }) {
            Object.defineProperty(StringList.prototype, i, {
                enumerable: false
            });
        }
    }

    idbModules.util.callback = callback;
    idbModules.util.StringList = StringList;
    idbModules.util.quote = function(arg) {
        return "\"" + arg + "\"";
    };

}(idbModules));

(function (idbModules) {
    'use strict';

    /**
     * Polyfills missing features in the browser's native IndexedDB implementation.
     * This is used for browsers that DON'T support WebSQL but DO support IndexedDB
     */
    function polyfill() {
        if (navigator.userAgent.match(/MSIE/) ||
            navigator.userAgent.match(/Trident/) ||
            navigator.userAgent.match(/Edge/)) {
            // Internet Explorer's native IndexedDB does not support compound keys
            compoundKeyPolyfill();
        }
    }

    /**
     * Polyfills support for compound keys
     */
    function compoundKeyPolyfill() {
        var cmp = IDBFactory.prototype.cmp;
        var createObjectStore = IDBDatabase.prototype.createObjectStore;
        var createIndex = IDBObjectStore.prototype.createIndex;
        var add = IDBObjectStore.prototype.add;
        var put = IDBObjectStore.prototype.put;
        var indexGet = IDBIndex.prototype.get;
        var indexGetKey = IDBIndex.prototype.getKey;
        var indexCursor = IDBIndex.prototype.openCursor;
        var indexKeyCursor = IDBIndex.prototype.openKeyCursor;
        var storeGet = IDBObjectStore.prototype.get;
        var storeDelete = IDBObjectStore.prototype.delete;
        var storeCursor = IDBObjectStore.prototype.openCursor;
        var storeKeyCursor = IDBObjectStore.prototype.openKeyCursor;
        var bound = IDBKeyRange.bound;
        var upperBound = IDBKeyRange.upperBound;
        var lowerBound = IDBKeyRange.lowerBound;
        var only = IDBKeyRange.only;
        var requestResult = Object.getOwnPropertyDescriptor(IDBRequest.prototype, 'result');
        var cursorPrimaryKey = Object.getOwnPropertyDescriptor(IDBCursor.prototype, 'primaryKey');
        var cursorKey = Object.getOwnPropertyDescriptor(IDBCursor.prototype, 'key');
        var cursorValue = Object.getOwnPropertyDescriptor(IDBCursorWithValue.prototype, 'value');

        IDBFactory.prototype.cmp = function(key1, key2) {
            var args = Array.prototype.slice.call(arguments);
            if (key1 instanceof Array) {
                args[0] = encodeCompoundKey(key1);
            }
            if (key2 instanceof Array) {
                args[1] = encodeCompoundKey(key2);
            }
            return cmp.apply(this, args);
        };

        IDBDatabase.prototype.createObjectStore = function(name, opts) {
            if (opts && opts.keyPath instanceof Array) {
                opts.keyPath = encodeCompoundKeyPath(opts.keyPath);
            }
            return createObjectStore.apply(this, arguments);
        };

        IDBObjectStore.prototype.createIndex = function(name, keyPath, opts) {
            var args = Array.prototype.slice.call(arguments);
            if (keyPath instanceof Array) {
                args[1] = encodeCompoundKeyPath(keyPath);
            }
            return createIndex.apply(this, args);
        };

        IDBObjectStore.prototype.add = function(value, key) {
            return this.__insertData(add, arguments);
        };

        IDBObjectStore.prototype.put = function(value, key) {
            return this.__insertData(put, arguments);
        };

        IDBObjectStore.prototype.__insertData = function(method, args) {
            args = Array.prototype.slice.call(args);
            var value = args[0];
            var key = args[1];

            // out-of-line key
            if (key instanceof Array) {
                args[1] = encodeCompoundKey(key);
            }

            if (typeof value === 'object') {
                // inline key
                if (isCompoundKey(this.keyPath)) {
                    setInlineCompoundKey(value, this.keyPath);
                }

                // inline indexes
                for (var i = 0; i < this.indexNames.length; i++) {
                    var index = this.index(this.indexNames[i]);
                    if (isCompoundKey(index.keyPath)) {
                        try {
                            setInlineCompoundKey(value, index.keyPath);
                        }
                        catch (e) {
                            // The value doesn't have a valid key for this index.
                        }
                    }
                }
            }
            return method.apply(this, args);
        };

        IDBIndex.prototype.get = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return indexGet.apply(this, args);
        };

        IDBIndex.prototype.getKey = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return indexGetKey.apply(this, args);
        };

        IDBIndex.prototype.openCursor = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return indexCursor.apply(this, args);
        };

        IDBIndex.prototype.openKeyCursor = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return indexKeyCursor.apply(this, args);
        };

        IDBObjectStore.prototype.get = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return storeGet.apply(this, args);
        };

        IDBObjectStore.prototype.delete = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return storeDelete.apply(this, args);
        };

        IDBObjectStore.prototype.openCursor = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return storeCursor.apply(this, args);
        };

        IDBObjectStore.prototype.openKeyCursor = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return storeKeyCursor.apply(this, args);
        };

        IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen) {
            var args = Array.prototype.slice.call(arguments);
            if (lower instanceof Array) {
                args[0] = encodeCompoundKey(lower);
            }
            if (upper instanceof Array) {
                args[1] = encodeCompoundKey(upper);
            }
            return bound.apply(IDBKeyRange, args);
        };

        IDBKeyRange.upperBound = function(key, open) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return upperBound.apply(IDBKeyRange, args);
        };

        IDBKeyRange.lowerBound = function(key, open) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return lowerBound.apply(IDBKeyRange, args);
        };

        IDBKeyRange.only = function(key) {
            var args = Array.prototype.slice.call(arguments);
            if (key instanceof Array) {
                args[0] = encodeCompoundKey(key);
            }
            return only.apply(IDBKeyRange, args);
        };

        Object.defineProperty(IDBRequest.prototype, 'result', {
            enumerable: requestResult.enumerable,
            configurable: requestResult.configurable,
            get: function() {
                var result = requestResult.get.call(this);
                return removeInlineCompoundKey(result);
            }
        });

        Object.defineProperty(IDBCursor.prototype, 'primaryKey', {
            enumerable: cursorPrimaryKey.enumerable,
            configurable: cursorPrimaryKey.configurable,
            get: function() {
                var result = cursorPrimaryKey.get.call(this);
                return removeInlineCompoundKey(result);
            }
        });

        Object.defineProperty(IDBCursor.prototype, 'key', {
            enumerable: cursorKey.enumerable,
            configurable: cursorKey.configurable,
            get: function() {
                var result = cursorKey.get.call(this);
                return removeInlineCompoundKey(result);
            }
        });

        Object.defineProperty(IDBCursorWithValue.prototype, 'value', {
            enumerable: cursorValue.enumerable,
            configurable: cursorValue.configurable,
            get: function() {
                var result = cursorValue.get.call(this);
                return removeInlineCompoundKey(result);
            }
        });

        try {
            if (!IDBTransaction.VERSION_CHANGE) {
                IDBTransaction.VERSION_CHANGE = 'versionchange';
            }
        }
        catch (e) {}
    }

    var compoundKeysPropertyName = '__$$compoundKey';
    var propertySeparatorRegExp = /\$\$/g;
    var propertySeparator = '$$$$';         // "$$" after RegExp escaping
    var keySeparator = '$_$';

    function isCompoundKey(keyPath) {
        return keyPath && (keyPath.indexOf(compoundKeysPropertyName + '.') === 0);
    }

    function encodeCompoundKeyPath(keyPath) {
        // Encoded dotted properties
        // ["name.first", "name.last"] ==> ["name$$first", "name$$last"]
        for (var i = 0; i < keyPath.length; i++) {
            keyPath[i] = keyPath[i].replace(/\./g, propertySeparator);
        }

        // Encode the array as a single property
        // ["name$$first", "name$$last"] => "__$$compoundKey.name$$first$_$name$$last"
        return compoundKeysPropertyName + '.' + keyPath.join(keySeparator);
    }

    function decodeCompoundKeyPath(keyPath) {
        // Remove the "__$$compoundKey." prefix
        keyPath = keyPath.substr(compoundKeysPropertyName.length + 1);

        // Split the properties into an array
        // "name$$first$_$name$$last" ==> ["name$$first", "name$$last"]
        keyPath = keyPath.split(keySeparator);

        // Decode dotted properties
        // ["name$$first", "name$$last"] ==> ["name.first", "name.last"]
        for (var i = 0; i < keyPath.length; i++) {
            keyPath[i] = keyPath[i].replace(propertySeparatorRegExp, '.');
        }
        return keyPath;
    }

    function setInlineCompoundKey(value, encodedKeyPath) {
        // Encode the key
        var keyPath = decodeCompoundKeyPath(encodedKeyPath);
        var key = idbModules.Key.getValue(value, keyPath);
        var encodedKey = encodeCompoundKey(key);

        // Store the encoded key inline
        encodedKeyPath = encodedKeyPath.substr(compoundKeysPropertyName.length + 1);
        value[compoundKeysPropertyName] = value[compoundKeysPropertyName] || {};
        value[compoundKeysPropertyName][encodedKeyPath] = encodedKey;
    }

    function removeInlineCompoundKey(value) {
        if (typeof value === "string" && isCompoundKey(value)) {
            return decodeCompoundKey(value);
        }
        else if (value && typeof value[compoundKeysPropertyName] === "object") {
            delete value[compoundKeysPropertyName];
        }
        return value;
    }

    function encodeCompoundKey(key) {
        // Validate and encode the key
        idbModules.Key.validate(key);
        key = idbModules.Key.encode(key);

        // Prepend the "__$$compoundKey." prefix
        key = compoundKeysPropertyName + '.' + key;

        validateKeyLength(key);
        return key;
    }

    function decodeCompoundKey(key) {
        validateKeyLength(key);

        // Remove the "__$$compoundKey." prefix
        key = key.substr(compoundKeysPropertyName.length + 1);

        // Decode the key
        key = idbModules.Key.decode(key);
        return key;
    }

    function validateKeyLength(key) {
        // BUG: Internet Explorer truncates string keys at 889 characters
        if (key.length > 889) {
            throw idbModules.util.createDOMException("DataError", "The encoded key is " + key.length + " characters long, but IE only allows 889 characters. Consider replacing numeric keys with strings to reduce the encoded length.");
        }
    }

    idbModules.polyfill = polyfill;
})(idbModules);

(function(idbModules){
    'use strict';

    /**
     * Implementation of the Structured Cloning Algorithm.  Supports the
     * following object types:
     * - Blob
     * - Boolean
     * - Date object
     * - File object (deserialized as Blob object).
     * - Number object
     * - RegExp object
     * - String object
     * This is accomplished by doing the following:
     * 1) Using the cycle/decycle functions from:
     *    https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
     * 2) Serializing/deserializing objects to/from string that don't work with
     *    JSON.stringify and JSON.parse by using object specific logic (eg use 
     *    the FileReader API to convert a Blob or File object to a data URL.   
     * 3) JSON.stringify and JSON.parse do the final conversion to/from string.
     */
    var Sca = (function(){
        return {
            decycle: function(object, callback) {
                //From: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
                // Contains additional logic to convert the following object types to string
                // so that they can properly be encoded using JSON.stringify:
                //  *Boolean
                //  *Date
                //  *File
                //  *Blob
                //  *Number
                //  *Regex
                // Make a deep copy of an object or array, assuring that there is at most
                // one instance of each object or array in the resulting structure. The
                // duplicate references (which might be forming cycles) are replaced with
                // an object of the form
                //      {$ref: PATH}
                // where the PATH is a JSONPath string that locates the first occurance.
                // So,
                //      var a = [];
                //      a[0] = a;
                //      return JSON.stringify(JSON.decycle(a));
                // produces the string '[{"$ref":"$"}]'.

                // JSONPath is used to locate the unique object. $ indicates the top level of
                // the object or array. [NUMBER] or [STRING] indicates a child member or
                // property.

                var objects = [],   // Keep a reference to each unique object or array
                paths = [],     // Keep the path to each unique object or array
                queuedObjects = [],
                returnCallback = callback;

                /**
                 * Check the queue to see if all objects have been processed.
                 * if they have, call the callback with the converted object.
                 */
                function checkForCompletion() {
                    if (queuedObjects.length === 0) {
                        returnCallback(derezObj);
                    }    
                }

                /**
                 * Convert a blob to a data URL.
                 * @param {Blob} blob to convert.
                 * @param {String} path of blob in object being encoded.
                 */
                function readBlobAsDataURL(blob, path) {
                    var reader = new FileReader();
                    reader.onloadend = function(loadedEvent) {
                        var dataURL = loadedEvent.target.result;
                        var blobtype = 'Blob';
                        if (blob instanceof File) {
                            //blobtype = 'File';
                        }
                        updateEncodedBlob(dataURL, path, blobtype);
                    };
                    reader.readAsDataURL(blob);
                }
                
                /**
                 * Async handler to update a blob object to a data URL for encoding.
                 * @param {String} dataURL
                 * @param {String} path
                 * @param {String} blobtype - file if the blob is a file; blob otherwise
                 */
                function updateEncodedBlob(dataURL, path, blobtype) {
                    var encoded = queuedObjects.indexOf(path);
                    path = path.replace('$','derezObj');
                    eval(path+'.$enc="'+dataURL+'"');
                    eval(path+'.$type="'+blobtype+'"');
                    queuedObjects.splice(encoded, 1);
                    checkForCompletion();
                }

                function derez(value, path) {

                    // The derez recurses through the object, producing the deep copy.

                    var i,          // The loop counter
                    name,       // Property name
                    nu;         // The new object or array

                    // typeof null === 'object', so go on if this value is really an object but not
                    // one of the weird builtin objects.

                    if (typeof value === 'object' && value !== null &&
                        !(value instanceof Boolean) &&
                        !(value instanceof Date)    &&
                        !(value instanceof Number)  &&
                        !(value instanceof RegExp)  &&
                        !(value instanceof Blob)  &&
                        !(value instanceof String)) {

                        // If the value is an object or array, look to see if we have already
                        // encountered it. If so, return a $ref/path object. This is a hard way,
                        // linear search that will get slower as the number of unique objects grows.

                        for (i = 0; i < objects.length; i += 1) {
                            if (objects[i] === value) {
                                return {$ref: paths[i]};
                            }
                        }

                        // Otherwise, accumulate the unique value and its path.

                        objects.push(value);
                        paths.push(path);

                        // If it is an array, replicate the array.

                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            nu = [];
                            for (i = 0; i < value.length; i += 1) {
                                nu[i] = derez(value[i], path + '[' + i + ']');
                            }
                        } else {
                            // If it is an object, replicate the object.
                            nu = {};
                            for (name in value) {
                                if (Object.prototype.hasOwnProperty.call(value, name)) {
                                    nu[name] = derez(value[name],
                                     path + '[' + JSON.stringify(name) + ']');
                                }
                            }
                        }

                        return nu;
                    } else if (value instanceof Blob) {
                        //Queue blob for conversion
                        queuedObjects.push(path);
                        readBlobAsDataURL(value, path);
                    } else if (value instanceof Boolean) {
                        value = {
                            '$type': 'Boolean',
                            '$enc': value.toString()
                        };
                    } else if (value instanceof Date) {
                        value = {
                            '$type': 'Date',
                            '$enc': value.getTime()
                        };
                    } else if (value instanceof Number) {
                        value = {
                            '$type': 'Number',
                            '$enc': value.toString()
                        };
                    } else if (value instanceof RegExp) {
                        value = {
                            '$type': 'RegExp',
                            '$enc': value.toString()
                        };
                    } else if (typeof value === 'number') {
                        value = {
                            '$type': 'number',
                            '$enc': value + ''  // handles NaN, Infinity, Negative Infinity
                        };
                    } else if (value === undefined) {
                        value = {
                            '$type': 'undefined'
                        };
                    }
                    return value;
                }
                var derezObj = derez(object, '$');
                checkForCompletion();
            },
                
            retrocycle: function retrocycle($) {
                //From: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
                // Contains additional logic to convert strings to the following object types 
                // so that they can properly be decoded:
                //  *Boolean
                //  *Date
                //  *File
                //  *Blob
                //  *Number
                //  *Regex
                // Restore an object that was reduced by decycle. Members whose values are
                // objects of the form
                //      {$ref: PATH}
                // are replaced with references to the value found by the PATH. This will
                // restore cycles. The object will be mutated.

                // The eval function is used to locate the values described by a PATH. The
                // root object is kept in a $ variable. A regular expression is used to
                // assure that the PATH is extremely well formed. The regexp contains nested
                // * quantifiers. That has been known to have extremely bad performance
                // problems on some browsers for very long strings. A PATH is expected to be
                // reasonably short. A PATH is allowed to belong to a very restricted subset of
                // Goessner's JSONPath.

                // So,
                //      var s = '[{"$ref":"$"}]';
                //      return JSON.retrocycle(JSON.parse(s));
                // produces an array containing a single element which is the array itself.

                var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
                
                /**
                 * Converts the specified data URL to a Blob object
                 * @param {String} dataURL to convert to a Blob
                 * @returns {Blob} the converted Blob object
                 */
                function dataURLToBlob(dataURL) {
                    var BASE64_MARKER = ';base64,',
                        contentType,
                        parts,
                        raw;
                    if (dataURL.indexOf(BASE64_MARKER) === -1) {
                        parts = dataURL.split(',');
                        contentType = parts[0].split(':')[1];
                        raw = parts[1];

                        return new Blob([raw], {type: contentType});
                    }

                    parts = dataURL.split(BASE64_MARKER);
                    contentType = parts[0].split(':')[1];
                    raw = window.atob(parts[1]);
                    var rawLength = raw.length;
                    var uInt8Array = new Uint8Array(rawLength);

                    for (var i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i);
                    }
                    return new Blob([uInt8Array.buffer], {type: contentType});
                }
                
                function rez(value) {
                    // The rez function walks recursively through the object looking for $ref
                    // properties. When it finds one that has a value that is a path, then it
                    // replaces the $ref object with a reference to the value that is found by
                    // the path.

                    var i, item, name, path;

                    if (value && typeof value === 'object') {
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            for (i = 0; i < value.length; i += 1) {
                                item = value[i];
                                if (item && typeof item === 'object') {
                                    path = item.$ref;
                                    if (typeof path === 'string' && px.test(path)) {
                                        value[i] = eval(path);
                                    } else {
                                        value[i] = rez(item);
                                    }
                                }
                            }
                        } else {
                            if (value.$type !== undefined) {
                                switch(value.$type) {
                                    case 'Blob':
                                    case 'File':
                                        value = dataURLToBlob(value.$enc);
                                        break;
                                    case 'Boolean':
                                        value = Boolean(value.$enc === 'true');
                                        break;
                                    case 'Date':
                                        value = new Date(value.$enc);
                                        break;
                                    case 'Number':
                                        value = Number(value.$enc);
                                        break;
                                    case 'RegExp':
                                        value = eval(value.$enc);
                                        break;
                                    case 'number':
                                        value = parseFloat(value.$enc);
                                        break;
                                    case 'undefined':
                                        value = undefined;
                                        break;
                                }
                            } else {
                                for (name in value) {
                                    if (typeof value[name] === 'object') {
                                        item = value[name];
                                        if (item) {
                                            path = item.$ref;
                                            if (typeof path === 'string' && px.test(path)) {
                                                value[name] = eval(path);
                                            } else {
                                                value[name] = rez(item);
                                            }
                                        }
                                    }   
                                }
                            }
                        }
                    }
                    return value;
                }
                return rez($);

            },

            /**
             * Encode the specified object as a string.  Because of the asynchronus
             * conversion of Blob/File to string, the encode function requires
             * a callback
             * @param {Object} val the value to convert.
             * @param {function} callback the function to call once conversion is
             * complete.  The callback gets called with the converted value.
             */
            "encode": function(val, callback){
                function finishEncode(val) {
                    callback(JSON.stringify(val));
                }
                this.decycle(val, finishEncode);                        
            },
                    
            /**
             * Deserialize the specified string to an object
             * @param {String} val the serialized string
             * @returns {Object} the deserialized object
             */
            "decode": function(val){
                return this.retrocycle(JSON.parse(val));
            }
        };
    }());
    idbModules.Sca = Sca;
}(idbModules));

(function(idbModules) {
    "use strict";

    /**
     * Encodes the keys based on their types. This is required to maintain collations
     */
    var collations = ["undefined", "number", "date", "string", "array"];

    /**
     * The sign values for numbers, ordered from least to greatest.
     *  - "negativeInfinity": Sorts below all other values.
     *  - "bigNegative": Negative values less than or equal to negative one.
     *  - "smallNegative": Negative values between negative one and zero, noninclusive.
     *  - "smallPositive": Positive values between zero and one, including zero but not one.
     *  - "largePositive": Positive values greater than or equal to one.
     *  - "positiveInfinity": Sorts above all other values.
     */
    var signValues = ["negativeInfinity", "bigNegative", "smallNegative", "smallPositive", "bigPositive", "positiveInfinity"];

    var types = {
        // Undefined is not a valid key type.  It's only used when there is no key.
        undefined: {
            encode: function(key) {
                return collations.indexOf("undefined") + "-";
            },
            decode: function(key) {
                return undefined;
            }
        },

        // Dates are encoded as ISO 8601 strings, in UTC time zone.
        date: {
            encode: function(key) {
                return collations.indexOf("date") + "-" + key.toJSON();
            },
            decode: function(key) {
                return new Date(key.substring(2));
            }
        },

        // Numbers are represented in a lexically sortable base-32 sign-exponent-mantissa
        // notation.
        //
        // sign: takes a value between zero and five, inclusive. Represents infinite cases
        //     and the signs of both the exponent and the fractional part of the number.
        // exponent: paded to two base-32 digits, represented by the 32's compliment in the
        //     "smallPositive" and "bigNegative" cases to ensure proper lexical sorting.
        // mantissa: also called the fractional part. Normed 11-digit base-32 representation.
        //     Represented by the 32's compliment in the "smallNegative" and "bigNegative"
        //     cases to ensure proper lexical sorting.
        number: {
            // The encode step checks for six numeric cases and generates 14-digit encoded
            // sign-exponent-mantissa strings.
            encode: function(key) {
                var key32 = Math.abs(key).toString(32);
                // Get the index of the decimal.
                var decimalIndex = key32.indexOf(".");
                // Remove the decimal.
                key32 = (decimalIndex !== -1) ? key32.replace(".", "") : key32;
                // Get the index of the first significant digit.
                var significantDigitIndex = key32.search(/[^0]/);
                // Truncate leading zeros.
                key32 = key32.slice(significantDigitIndex);
                var sign, exponent = zeros(2), mantissa = zeros(11);

                // Finite cases:
                if (isFinite(key)) {
                    // Negative cases:
                    if (key < 0) {
                        // Negative exponent case:
                        if (key > -1) {
                            sign = signValues.indexOf("smallNegative");
                            exponent = padBase32Exponent(significantDigitIndex);
                            mantissa = flipBase32(padBase32Mantissa(key32));
                        }
                        // Non-negative exponent case:
                        else {
                            sign = signValues.indexOf("bigNegative");
                            exponent = flipBase32(padBase32Exponent(
                                (decimalIndex !== -1) ? decimalIndex : key32.length
                            ));
                            mantissa = flipBase32(padBase32Mantissa(key32));
                        }
                    }
                    // Non-negative cases:
                    else {
                        // Negative exponent case:
                        if (key < 1) {
                            sign = signValues.indexOf("smallPositive");
                            exponent = flipBase32(padBase32Exponent(significantDigitIndex));
                            mantissa = padBase32Mantissa(key32);
                        }
                        // Non-negative exponent case:
                        else {
                            sign = signValues.indexOf("bigPositive");
                            exponent = padBase32Exponent(
                                (decimalIndex !== -1) ? decimalIndex : key32.length
                            );
                            mantissa = padBase32Mantissa(key32);
                        }
                    }
                }
                // Infinite cases:
                else {
                    sign = signValues.indexOf(
                        key > 0 ? "positiveInfinity" : "negativeInfinity"
                    );
                }

                return collations.indexOf("number") + "-" + sign + exponent + mantissa;
            },
            // The decode step must interpret the sign, reflip values encoded as the 32's complements,
            // apply signs to the exponent and mantissa, do the base-32 power operation, and return
            // the original JavaScript number values.
            decode: function(key) {
                var sign = +key.substr(2, 1);
                var exponent = key.substr(3, 2);
                var mantissa = key.substr(5, 11);

                switch (signValues[sign]) {
                    case "negativeInfinity":
                        return -Infinity;
                    case "positiveInfinity":
                        return Infinity;
                    case "bigPositive":
                        return pow32(mantissa, exponent);
                    case "smallPositive":
                        exponent = negate(flipBase32(exponent));
                        return pow32(mantissa, exponent);
                    case "smallNegative":
                        exponent = negate(exponent);
                        mantissa = flipBase32(mantissa);
                        return -pow32(mantissa, exponent);
                    case "bigNegative":
                        exponent = flipBase32(exponent);
                        mantissa = flipBase32(mantissa);
                        return -pow32(mantissa, exponent);
                    default:
                        throw new Error("Invalid number.");
                }
            }
        },

        // Strings are encoded as JSON strings (with quotes and unicode characters escaped).
        //
        // IF the strings are in an array, then some extra encoding is done to make sorting work correctly:
        // Since we can't force all strings to be the same length, we need to ensure that characters line-up properly
        // for sorting, while also accounting for the extra characters that are added when the array itself is encoded as JSON.
        // To do this, each character of the string is prepended with a dash ("-"), and a space is added to the end of the string.
        // This effectively doubles the size of every string, but it ensures that when two arrays of strings are compared,
        // the indexes of each string's characters line up with each other.
        string: {
            encode: function(key, inArray) {
                if (inArray) {
                    // prepend each character with a dash, and append a space to the end
                    key = key.replace(/(.)/g, '-$1') + ' ';
                }
                return collations.indexOf("string") + "-" + key;
            },
            decode: function(key, inArray) {
                key = key.substring(2);
                if (inArray) {
                    // remove the space at the end, and the dash before each character
                    key = key.substr(0, key.length - 1).replace(/-(.)/g, '$1');
                }
                return key;
            }
        },

        // Arrays are encoded as JSON strings.
        // An extra, value is added to each array during encoding to make empty arrays sort correctly.
        array: {
            encode: function(key) {
                var encoded = [];
                for (var i = 0; i < key.length; i++) {
                    var item = key[i];
                    var encodedItem = idbModules.Key.encode(item, true);        // encode the array item
                    encoded[i] = encodedItem;
                }
                encoded.push(collations.indexOf("undefined") + "-");            // append an extra item, so empty arrays sort correctly
                return collations.indexOf("array") + "-" + JSON.stringify(encoded);
            },
            decode: function(key) {
                var decoded = JSON.parse(key.substring(2));
                decoded.pop();                                                  // remove the extra item
                for (var i = 0; i < decoded.length; i++) {
                    var item = decoded[i];
                    var decodedItem = idbModules.Key.decode(item, true);        // decode the item
                    decoded[i] = decodedItem;
                }
                return decoded;
            }
        }
    };

    /**
     * Return a padded base-32 exponent value.
     * @param {number}
     * @return {string}
     */
    function padBase32Exponent(n) {
        n = n.toString(32);
        return (n.length === 1) ? "0" + n : n;
    }

    /**
     * Return a padded base-32 mantissa.
     * @param {string}
     * @return {string}
     */
    function padBase32Mantissa(s) {
        return (s + zeros(11)).slice(0, 11);
    }

    /**
     * Flips each digit of a base-32 encoded string.
     * @param {string} encoded
     */
    function flipBase32(encoded) {
        var flipped = "";
        for (var i = 0; i < encoded.length; i++) {
            flipped += (31 - parseInt(encoded[i], 32)).toString(32);
        }
        return flipped;
    }

    /**
     * Base-32 power function.
     * RESEARCH: This function does not precisely decode floats because it performs
     * floating point arithmetic to recover values. But can the original values be
     * recovered exactly?
     * Someone may have already figured out a good way to store JavaScript floats as
     * binary strings and convert back. Barring a better method, however, one route
     * may be to generate decimal strings that `parseFloat` decodes predictably.
     * @param {string}
     * @param {string}
     * @return {number}
     */
    function pow32(mantissa, exponent) {
        var whole, fraction, expansion;
        exponent = parseInt(exponent, 32);
        if (exponent < 0) {
            return roundToPrecision(
                parseInt(mantissa, 32) * Math.pow(32, exponent - 10)
            );
        }
        else {
            if (exponent < 11) {
                whole = mantissa.slice(0, exponent);
                whole = parseInt(whole, 32);
                fraction = mantissa.slice(exponent);
                fraction = parseInt(fraction, 32) * Math.pow(32, exponent - 11);
                return roundToPrecision(whole + fraction);
            }
            else {
                expansion = mantissa + zeros(exponent - 11);
                return parseInt(expansion, 32);
            }
        }
    }

    /**
     *
     */
    function roundToPrecision(num, precision) {
        precision = precision || 16;
        return parseFloat(num.toPrecision(precision));
    }

    /**
     * Returns a string of n zeros.
     * @param {number}
     * @return {string}
     */
    function zeros(n) {
        var result = "";
        while (n--) {
            result = result + "0";
        }
        return result;
    }

    /**
     * Negates numeric strings.
     * @param {string}
     * @return {string}
     */
    function negate(s) {
        return "-" + s;
    }

    /**
     * Returns the string "number", "date", "string", or "array".
     */
    function getType(key) {
        if (key instanceof Date) {
            return "date";
        }
        if (key instanceof Array) {
            return "array";
        }
        return typeof key;
    }

    /**
     * Keys must be strings, numbers, Dates, or Arrays
     */
    function validate(key) {
        var type = getType(key);
        if (type === "array") {
            for (var i = 0; i < key.length; i++) {
                validate(key[i]);
            }
        }
        else if (!types[type] || (type !== "string" && isNaN(key))) {
            throw idbModules.util.createDOMException("DataError", "Not a valid key");
        }
    }

    /**
     * Returns the value of an inline key
     * @param {object} source
     * @param {string|array} keyPath
     */
    function getValue(source, keyPath) {
        try {
            if (keyPath instanceof Array) {
                var arrayValue = [];
                for (var i = 0; i < keyPath.length; i++) {
                    arrayValue.push(eval("source." + keyPath[i]));
                }
                return arrayValue;
            } else {
                return eval("source." + keyPath);
            }
        }
        catch (e) {
            return undefined;
        }
    }

    /**
     * Sets the inline key value
     * @param {object} source
     * @param {string} keyPath
     * @param {*} value
     */
    function setValue(source, keyPath, value) {
        var props = keyPath.split('.');
        for (var i = 0; i < props.length - 1; i++) {
            var prop = props[i];
            source = source[prop] = source[prop] || {};
        }
        source[props[props.length - 1]] = value;
    }

    /**
     * Determines whether an index entry matches a multi-entry key value.
     * @param {string} encodedEntry     The entry value (already encoded)
     * @param {string} encodedKey       The full index key (already encoded)
     * @returns {boolean}
     */
    function isMultiEntryMatch(encodedEntry, encodedKey) {
        var keyType = collations[encodedKey.substring(0, 1)];

        if (keyType === "array") {
            return encodedKey.indexOf(encodedEntry) > 1;
        }
        else {
            return encodedKey === encodedEntry;
        }
    }

    function isKeyInRange(key, range) {
        var lowerMatch = range.lower === undefined;
        var upperMatch = range.upper === undefined;
        var encodedKey = idbModules.Key.encode(key, true);

        if (range.lower !== undefined) {
            if (range.lowerOpen && encodedKey > range.__lower) {
                lowerMatch = true;
            }
            if (!range.lowerOpen && encodedKey >= range.__lower) {
                lowerMatch = true;
            }
        }
        if (range.upper !== undefined) {
            if (range.upperOpen && encodedKey < range.__upper) {
                upperMatch = true;
            }
            if (!range.upperOpen && encodedKey <= range.__upper) {
                upperMatch = true;
            }
        }

        return lowerMatch && upperMatch;
    }

    function findMultiEntryMatches(keyEntry, range) {
        var matches = [];

        if (keyEntry instanceof Array) {
            for (var i = 0; i < keyEntry.length; i++) {
                var key = keyEntry[i];

                if (key instanceof Array) {
                    if (range.lower === range.upper) {
                        continue;
                    }
                    if (key.length === 1) {
                        key = key[0];
                    } else {
                        var nested = findMultiEntryMatches(key, range);
                        if (nested.length > 0) {
                            matches.push(key);
                        }
                        continue;
                    }
                }

                if (isKeyInRange(key, range)) {
                    matches.push(key);
                }
            }
        } else {
            if (isKeyInRange(keyEntry, range)) {
                matches.push(keyEntry);
            }
        }
        return matches;
    }

    idbModules.Key = {
        encode: function(key, inArray) {
            if (key === undefined) {
                return null;
            }
            return types[getType(key)].encode(key, inArray);
        },
        decode: function(key, inArray) {
            if (typeof key !== "string") {
                return undefined;
            }
            return types[collations[key.substring(0, 1)]].decode(key, inArray);
        },
        validate: validate,
        getValue: getValue,
        setValue: setValue,
        isMultiEntryMatch: isMultiEntryMatch,
        findMultiEntryMatches: findMultiEntryMatches
    };
}(idbModules));

(function(idbModules) {
    'use strict';

    /**
     * Creates a native Event object, for browsers that support it
     * @returns {Event}
     */
    function createNativeEvent(type, debug) {
        var event = new Event(type);
        event.debug = debug;

        // Make the "target" writable
        Object.defineProperty(event, 'target', {
            writable: true
        });

        return event;
    }

    /**
     * A shim Event class, for browsers that don't allow us to create native Event objects.
     * @constructor
     */
    function ShimEvent(type, debug) {
        this.type = type;
        this.debug = debug;
        this.bubbles = false;
        this.cancelable = false;
        this.eventPhase = 0;
        this.timeStamp = new Date().valueOf();
    }

    var useNativeEvent = false;
    try {
        // Test whether we can use the browser's native Event class
        var test = createNativeEvent('test type', 'test debug');
        var target = {test: 'test target'};
        test.target = target;

        if (test instanceof Event && test.type === 'test type' && test.debug === 'test debug' && test.target === target) {
            // Native events work as expected
            useNativeEvent = true;
        }
    }
    catch (e) {}

    if (useNativeEvent) {
        idbModules.Event = Event;
        idbModules.IDBVersionChangeEvent = Event;
        idbModules.util.createEvent = createNativeEvent;
    }
    else {
        idbModules.Event = ShimEvent;
        idbModules.IDBVersionChangeEvent = ShimEvent;
        idbModules.util.createEvent = function(type, debug) {
            return new ShimEvent(type, debug);
        };
    }
}(idbModules));

(function(idbModules) {
    'use strict';

    /**
     * Creates a native DOMException, for browsers that support it
     * @returns {DOMException}
     */
    function createNativeDOMException(name, message) {
        var e = new DOMException.prototype.constructor(0, message);
        e.name = name || 'DOMException';
        e.message = message;
        return e;
    }

    /**
     * Creates a native DOMError, for browsers that support it
     * @returns {DOMError}
     */
    function createNativeDOMError(name, message) {
        name = name || 'DOMError';
        var e = new DOMError(name, message);
        e.name === name || (e.name = name);
        e.message === message || (e.message = message);
        return e;
    }

    /**
     * Creates a generic Error object
     * @returns {Error}
     */
    function createError(name, message) {
        var e = new Error(message);
        e.name = name || 'DOMException';
        e.message = message;
        return e;
    }

    /**
     * Logs detailed error information to the console.
     * @param {string} name
     * @param {string} message
     * @param {string|Error|null} error
     */
    idbModules.util.logError = function(name, message, error) {
        if (idbModules.DEBUG) {
            if (error && error.message) {
                error = error.message;
            }

            var method = typeof(console.error) === 'function' ? 'error' : 'log';
            console[method](name + ': ' + message + '. ' + (error || ''));
            console.trace && console.trace();
        }
    };

    /**
     * Finds the error argument.  This is useful because some WebSQL callbacks
     * pass the error as the first argument, and some pass it as the second argument.
     * @param {array} args
     * @returns {Error|DOMException|undefined}
     */
    idbModules.util.findError = function(args) {
        var err;
        if (args) {
            if (args.length === 1) {
                return args[0];
            }
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof Error || arg instanceof DOMException) {
                    return arg;
                }
                else if (arg && typeof arg.message === "string") {
                    err = arg;
                }
            }
        }
        return err;
    };

    var test, useNativeDOMException = false, useNativeDOMError = false;

    // Test whether we can use the browser's native DOMException class
    try {
        test = createNativeDOMException('test name', 'test message');
        if (test instanceof DOMException && test.name === 'test name' && test.message === 'test message') {
            // Native DOMException works as expected
            useNativeDOMException = true;
        }
    }
    catch (e) {}

    // Test whether we can use the browser's native DOMError class
    try {
        test = createNativeDOMError('test name', 'test message');
        if (test instanceof DOMError && test.name === 'test name' && test.message === 'test message') {
            // Native DOMError works as expected
            useNativeDOMError = true;
        }
    }
    catch (e) {}

    if (useNativeDOMException) {
        idbModules.DOMException = DOMException;
        idbModules.util.createDOMException = function(name, message, error) {
            idbModules.util.logError(name, message, error);
            return createNativeDOMException(name, message);
        };
    }
    else {
        idbModules.DOMException = Error;
        idbModules.util.createDOMException = function(name, message, error) {
            idbModules.util.logError(name, message, error);
            return createError(name, message);
        };
    }

    if (useNativeDOMError) {
        idbModules.DOMError = DOMError;
        idbModules.util.createDOMError = function(name, message, error) {
            idbModules.util.logError(name, message, error);
            return createNativeDOMError(name, message);
        };
    }
    else {
        idbModules.DOMError = Error;
        idbModules.util.createDOMError = function(name, message, error) {
            idbModules.util.logError(name, message, error);
            return createError(name, message);
        };
    }
}(idbModules));

(function(idbModules){
    'use strict';

    /**
     * The IDBRequest Object that is returns for all async calls
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#request-api
     */
    function IDBRequest(){
        this.onsuccess = this.onerror = this.result = this.error = this.source = this.transaction = null;
        this.readyState = "pending";
    }

    /**
     * The IDBOpenDBRequest called when a database is opened
     */
    function IDBOpenDBRequest(){
        this.onblocked = this.onupgradeneeded = null;
    }
    IDBOpenDBRequest.prototype = new IDBRequest();
    IDBOpenDBRequest.prototype.constructor = IDBOpenDBRequest;
    
    idbModules.IDBRequest = IDBRequest;
    idbModules.IDBOpenDBRequest = IDBOpenDBRequest;
    
}(idbModules));

(function(idbModules, undefined){
    'use strict';

    /**
     * The IndexedDB KeyRange object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#dfn-key-range
     * @param {Object} lower
     * @param {Object} upper
     * @param {Object} lowerOpen
     * @param {Object} upperOpen
     */
    function IDBKeyRange(lower, upper, lowerOpen, upperOpen){
        if (lower !== undefined) {
            idbModules.Key.validate(lower);
        }
        if (upper !== undefined) {
            idbModules.Key.validate(upper);
        }

        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = !!lowerOpen;
        this.upperOpen = !!upperOpen;
    }

    IDBKeyRange.only = function(value){
        return new IDBKeyRange(value, value, false, false);
    };

    IDBKeyRange.lowerBound = function(value, open){
        return new IDBKeyRange(value, undefined, open, undefined);
    };
    IDBKeyRange.upperBound = function(value, open){
        return new IDBKeyRange(undefined, value, undefined, open);
    };
    IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen){
        return new IDBKeyRange(lower, upper, lowerOpen, upperOpen);
    };

    idbModules.IDBKeyRange = IDBKeyRange;

}(idbModules));

(function(idbModules, undefined){
    'use strict';

    /**
     * The IndexedDB Cursor Object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBCursor
     * @param {IDBKeyRange} range
     * @param {string} direction
     * @param {IDBObjectStore} store
     * @param {IDBObjectStore|IDBIndex} source
     * @param {string} keyColumnName
     * @param {string} valueColumnName
     * @param {boolean} count
     */
    function IDBCursor(range, direction, store, source, keyColumnName, valueColumnName, count){
        // Calling openCursor on an index or objectstore with null is allowed but we treat it as undefined internally
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof idbModules.IDBKeyRange)) {
            range = new idbModules.IDBKeyRange(range, range, false, false);
        }
        store.transaction.__assertActive();
        if (direction !== undefined && ["next", "prev", "nextunique", "prevunique"].indexOf(direction) === -1) {
            throw new TypeError(direction + "is not a valid cursor direction");
        }

        this.source = source;
        this.direction = direction || "next";
        this.key = undefined;
        this.primaryKey = undefined;
        this.__store = store;
        this.__range = range;
        this.__req = new idbModules.IDBRequest();
        this.__keyColumnName = keyColumnName;
        this.__valueColumnName = valueColumnName;
        this.__valueDecoder = valueColumnName === "value" ? idbModules.Sca : idbModules.Key;
        this.__count = count;
        this.__offset = -1; // Setting this to -1 as continue will set it to 0 anyway
        this.__lastKeyContinued = undefined; // Used when continuing with a key
        this.__multiEntryIndex = source instanceof idbModules.IDBIndex ? source.multiEntry : false;
        this.__unique = this.direction.indexOf("unique") !== -1;

        if (range !== undefined) {
            // Encode the key range and cache the encoded values, so we don't have to re-encode them over and over
            range.__lower = range.lower !== undefined && idbModules.Key.encode(range.lower, this.__multiEntryIndex);
            range.__upper = range.upper !== undefined && idbModules.Key.encode(range.upper, this.__multiEntryIndex);
        }

        this["continue"]();
    }

    IDBCursor.prototype.__find = function (/* key, tx, success, error, recordsToLoad */) {
        var args = Array.prototype.slice.call(arguments);
        if (this.__multiEntryIndex) {
            this.__findMultiEntry.apply(this, args);
        } else {
            this.__findBasic.apply(this, args);
        }
    };

    IDBCursor.prototype.__findBasic = function (key, tx, success, error, recordsToLoad) {
        recordsToLoad = recordsToLoad || 1;

        var me = this;
        var quotedKeyColumnName = idbModules.util.quote(me.__keyColumnName);
        var sql = ["SELECT * FROM", idbModules.util.quote(me.__store.name)];
        var sqlValues = [];
        sql.push("WHERE", quotedKeyColumnName, "NOT NULL");
        if (me.__range && (me.__range.lower !== undefined || me.__range.upper !== undefined )) {
            sql.push("AND");
            if (me.__range.lower !== undefined) {
                sql.push(quotedKeyColumnName, (me.__range.lowerOpen ? ">" : ">="), "?");
                sqlValues.push(me.__range.__lower);
            }
            (me.__range.lower !== undefined && me.__range.upper !== undefined) && sql.push("AND");
            if (me.__range.upper !== undefined) {
                sql.push(quotedKeyColumnName, (me.__range.upperOpen ? "<" : "<="), "?");
                sqlValues.push(me.__range.__upper);
            }
        }
        if (typeof key !== "undefined") {
            me.__lastKeyContinued = key;
            me.__offset = 0;
        }
        if (me.__lastKeyContinued !== undefined) {
            sql.push("AND", quotedKeyColumnName, ">= ?");
            idbModules.Key.validate(me.__lastKeyContinued);
            sqlValues.push(idbModules.Key.encode(me.__lastKeyContinued));
        }

        // Determine the ORDER BY direction based on the cursor.
        var direction = me.direction === 'prev' || me.direction === 'prevunique' ? 'DESC' : 'ASC';

        if (!me.__count) {
            sql.push("ORDER BY", quotedKeyColumnName, direction);
            sql.push("LIMIT", recordsToLoad, "OFFSET", me.__offset);
        }
        sql = sql.join(" ");
        idbModules.DEBUG && console.log(sql, sqlValues);

        me.__prefetchedData = null;
        me.__prefetchedIndex = 0;
        tx.executeSql(sql, sqlValues, function (tx, data) {
            if (me.__count) {
                success(undefined, data.rows.length, undefined);
            }
            else if (data.rows.length > 1) {
                me.__prefetchedData = data.rows;
                me.__prefetchedIndex = 0;
                idbModules.DEBUG && console.log("Preloaded " + me.__prefetchedData.length + " records for cursor");
                me.__decode(data.rows.item(0), success);
            }
            else if (data.rows.length === 1) {
                me.__decode(data.rows.item(0), success);
            }
            else {
                idbModules.DEBUG && console.log("Reached end of cursors");
                success(undefined, undefined, undefined);
            }
        }, function (tx, err) {
            idbModules.DEBUG && console.log("Could not execute Cursor.continue", sql, sqlValues);
            error(err);
        });
    };

    IDBCursor.prototype.__findMultiEntry = function (key, tx, success, error) {
        var me = this;

        if (me.__prefetchedData && me.__prefetchedData.length === me.__prefetchedIndex) {
            idbModules.DEBUG && console.log("Reached end of multiEntry cursor");
            success(undefined, undefined, undefined);
            return;
        }

        var quotedKeyColumnName = idbModules.util.quote(me.__keyColumnName);
        var sql = ["SELECT * FROM", idbModules.util.quote(me.__store.name)];
        var sqlValues = [];
        sql.push("WHERE", quotedKeyColumnName, "NOT NULL");
        if (me.__range && (me.__range.lower !== undefined && me.__range.upper !== undefined)) {
            if (me.__range.upper.indexOf(me.__range.lower) === 0) {
                sql.push("AND", quotedKeyColumnName, "LIKE ?");
                sqlValues.push("%" + me.__range.__lower.slice(0, -1) + "%");
            }
        }
        if (typeof key !== "undefined") {
            me.__lastKeyContinued = key;
            me.__offset = 0;
        }
        if (me.__lastKeyContinued !== undefined) {
            sql.push("AND", quotedKeyColumnName, ">= ?");
            idbModules.Key.validate(me.__lastKeyContinued);
            sqlValues.push(idbModules.Key.encode(me.__lastKeyContinued));
        }

        // Determine the ORDER BY direction based on the cursor.
        var direction = me.direction === 'prev' || me.direction === 'prevunique' ? 'DESC' : 'ASC';

        if (!me.__count) {
            sql.push("ORDER BY key", direction);
        }
        sql = sql.join(" ");
        idbModules.DEBUG && console.log(sql, sqlValues);

        me.__prefetchedData = null;
        me.__prefetchedIndex = 0;
        tx.executeSql(sql, sqlValues, function (tx, data) {
            me.__multiEntryOffset = data.rows.length;

            if (data.rows.length > 0) {
                var rows = [];

                for (var i = 0; i < data.rows.length; i++) {
                    var rowItem = data.rows.item(i);
                    var rowKey = idbModules.Key.decode(rowItem[me.__keyColumnName], true);
                    var matches = idbModules.Key.findMultiEntryMatches(rowKey, me.__range);

                    for (var j = 0; j < matches.length; j++) {
                        var matchingKey = matches[j];
                        var clone = {
                            matchingKey: idbModules.Key.encode(matchingKey, true),
                            key: rowItem.key
                        };
                        clone[me.__keyColumnName] = rowItem[me.__keyColumnName];
                        clone[me.__valueColumnName] = rowItem[me.__valueColumnName];
                        rows.push(clone);
                    }
                }

                var reverse = me.direction.indexOf("prev") === 0;
                rows.sort(function (a, b) {
                    if (a.matchingKey.replace('[','z') < b.matchingKey.replace('[','z')) {
                        return reverse ? 1 : -1;
                    }
                    if (a.matchingKey.replace('[','z') > b.matchingKey.replace('[','z')) {
                        return reverse ? -1 : 1;
                    }
                    if (a.key < b.key) {
                        return me.direction === "prev" ? 1 : -1;
                    }
                    if (a.key > b.key) {
                        return me.direction === "prev" ? -1 : 1;
                    }
                    return 0;
                });

                me.__prefetchedData = {
                    data: rows,
                    length: rows.length,
                    item: function (index) {
                        return this.data[index];
                    }
                };
                me.__prefetchedIndex = 0;

                if (me.__count) {
                    success(undefined, rows.length, undefined);
                }
                else if (rows.length > 1) {
                    idbModules.DEBUG && console.log("Preloaded " + me.__prefetchedData.length + " records for multiEntry cursor");
                    me.__decode(rows[0], success);
                } else if (rows.length === 1) {
                    idbModules.DEBUG && console.log("Reached end of multiEntry cursor");
                    me.__decode(rows[0], success);
                } else {
                    idbModules.DEBUG && console.log("Reached end of multiEntry cursor");
                    success(undefined, undefined, undefined);
                }
            }
            else {
                idbModules.DEBUG && console.log("Reached end of multiEntry cursor");
                success(undefined, undefined, undefined);
            }
        }, function (tx, err) {
            idbModules.DEBUG && console.log("Could not execute Cursor.continue", sql, sqlValues);
            error(err);
        });
    };

    /**
     * Creates an "onsuccess" callback
     * @private
     */
    IDBCursor.prototype.__onsuccess = function(success) {
        var me = this;
        return function(key, value, primaryKey) {
            if (me.__count) {
                success(value, me.__req);
            }
            else {
                me.key = key === undefined ? null : key;
                me.value = value === undefined ? null : value;
                me.primaryKey = primaryKey === undefined ? null : primaryKey;
                var result = key === undefined ? null : me;
                success(result, me.__req);
            }
        };
    };

    IDBCursor.prototype.__decode = function (rowItem, callback) {
        if (this.__multiEntryIndex && this.__unique) {
            if (!this.__matchedKeys) {
                this.__matchedKeys = {};
            }
            if (this.__matchedKeys[rowItem.matchingKey]) {
                callback(undefined, undefined, undefined);
                return;
            }
            this.__matchedKeys[rowItem.matchingKey] = true;
        }
        var key = idbModules.Key.decode(this.__multiEntryIndex ? rowItem.matchingKey : rowItem[this.__keyColumnName], this.__multiEntryIndex);
        var val = this.__valueDecoder.decode(rowItem[this.__valueColumnName]);
        var primaryKey = idbModules.Key.decode(rowItem.key);
        callback(key, val, primaryKey);
    };

    IDBCursor.prototype["continue"] = function (key) {
        var recordsToPreloadOnContinue = idbModules.cursorPreloadPackSize || 100;
        var me = this;

        this.__store.transaction.__pushToQueue(me.__req, function cursorContinue(tx, args, success, error) {
            me.__offset++;

            if (me.__prefetchedData) {
                // We have pre-loaded data for the cursor
                me.__prefetchedIndex++;
                if (me.__prefetchedIndex < me.__prefetchedData.length) {
                    me.__decode(me.__prefetchedData.item(me.__prefetchedIndex), me.__onsuccess(success));
                    return;
                }
            }

            // No pre-fetched data, do query
            me.__find(key, tx, me.__onsuccess(success), error, recordsToPreloadOnContinue);
        });
    };

    IDBCursor.prototype.advance = function(count){
        if (count <= 0) {
            throw idbModules.util.createDOMException("Type Error", "Count is invalid - 0 or negative", count);
        }
        var me = this;
        this.__store.transaction.__pushToQueue(me.__req, function cursorAdvance(tx, args, success, error){
            me.__offset += count;
            me.__find(undefined, tx, me.__onsuccess(success), error);
        });
    };

    IDBCursor.prototype.update = function(valueToUpdate){
        var me = this;
        me.__store.transaction.__assertWritable();
        return me.__store.transaction.__addToTransactionQueue(function cursorUpdate(tx, args, success, error){
            idbModules.Sca.encode(valueToUpdate, function(encoded) {
                me.__find(undefined, tx, function(key, value, primaryKey){
                    var store = me.__store;
                    var params = [encoded];
                    var sql = ["UPDATE", idbModules.util.quote(store.name), "SET value = ?"];
                    idbModules.Key.validate(primaryKey);

                    // Also correct the indexes in the table
                    for (var i = 0; i < store.indexNames.length; i++) {
                        var index = store.__indexes[store.indexNames[i]];
                        var indexKey = idbModules.Key.getValue(valueToUpdate, index.keyPath);
                        sql.push(",", idbModules.util.quote(index.name), "= ?");
                        params.push(idbModules.Key.encode(indexKey, index.multiEntry));
                    }

                    sql.push("WHERE key = ?");
                    params.push(idbModules.Key.encode(primaryKey));

                    idbModules.DEBUG && console.log(sql.join(" "), encoded, key, primaryKey);
                    tx.executeSql(sql.join(" "), params, function(tx, data){
                        me.__prefetchedData = null;
                        me.__prefetchedIndex = 0;
                        if (data.rowsAffected === 1) {
                            success(key);
                        }
                        else {
                            error("No rows with key found" + key);
                        }
                    }, function(tx, data){
                        error(data);
                    });
                }, error);
            });
        });
    };

    IDBCursor.prototype["delete"] = function(){
        var me = this;
        me.__store.transaction.__assertWritable();
        return this.__store.transaction.__addToTransactionQueue(function cursorDelete(tx, args, success, error){
            me.__find(undefined, tx, function(key, value, primaryKey){
                var sql = "DELETE FROM  " + idbModules.util.quote(me.__store.name) + " WHERE key = ?";
                idbModules.DEBUG && console.log(sql, key, primaryKey);
                idbModules.Key.validate(primaryKey);
                tx.executeSql(sql, [idbModules.Key.encode(primaryKey)], function(tx, data){
                    me.__prefetchedData = null;
                    me.__prefetchedIndex = 0;
                    if (data.rowsAffected === 1) {
                        // lower the offset or we will miss a row
                        me.__offset--;
                        success(undefined);
                    }
                    else {
                        error("No rows with key found" + key);
                    }
                }, function(tx, data){
                    error(data);
                });
            }, error);
        });
    };

    idbModules.IDBCursor = IDBCursor;
}(idbModules));

(function(idbModules, undefined) {
    'use strict';

    /**
     * IDB Index
     * http://www.w3.org/TR/IndexedDB/#idl-def-IDBIndex
     * @param {IDBObjectStore} store
     * @param {IDBIndexProperties} indexProperties
     * @constructor
     */
    function IDBIndex(store, indexProperties) {
        this.objectStore = store;
        this.name = indexProperties.columnName;
        this.keyPath = indexProperties.keyPath;
        this.multiEntry = indexProperties.optionalParams && indexProperties.optionalParams.multiEntry;
        this.unique = indexProperties.optionalParams && indexProperties.optionalParams.unique;
        this.__deleted = !!indexProperties.__deleted;
    }

    /**
     * Clones an IDBIndex instance for a different IDBObjectStore instance.
     * @param {IDBIndex} index
     * @param {IDBObjectStore} store
     * @protected
     */
    IDBIndex.__clone = function(index, store) {
        return new IDBIndex(store, {
            columnName: index.name,
            keyPath: index.keyPath,
            optionalParams: {
                multiEntry: index.multiEntry,
                unique: index.unique
            }
        });
    };

    /**
     * Creates a new index on an object store.
     * @param {IDBObjectStore} store
     * @param {IDBIndex} index
     * @returns {IDBIndex}
     * @protected
     */
    IDBIndex.__createIndex = function(store, index) {
        var columnExists = !!store.__indexes[index.name] && store.__indexes[index.name].__deleted;

        // Add the index to the IDBObjectStore
        store.__indexes[index.name] = index;
        store.indexNames.push(index.name);

        // Create the index in WebSQL
        var transaction = store.transaction;
        transaction.__addToTransactionQueue(function createIndex(tx, args, success, failure) {
            function error(tx, err) {
                failure(idbModules.util.createDOMException(0, "Could not create index \"" + index.name + "\"", err));
            }

            function applyIndex(tx) {
                // Update the object store's index list
                IDBIndex.__updateIndexList(store, tx, function() {
                    // Add index entries for all existing records
                    tx.executeSql("SELECT * FROM " + idbModules.util.quote(store.name), [], function(tx, data) {
                        idbModules.DEBUG && console.log("Adding existing " + store.name + " records to the " + index.name + " index");
                        addIndexEntry(0);

                        function addIndexEntry(i) {
                            if (i < data.rows.length) {
                                try {
                                    var value = idbModules.Sca.decode(data.rows.item(i).value);
                                    var indexKey = idbModules.Key.getValue(value, index.keyPath);
                                    indexKey = idbModules.Key.encode(indexKey, index.multiEntry);

                                    tx.executeSql("UPDATE " + idbModules.util.quote(store.name) + " set " + idbModules.util.quote(index.name) + " = ? where key = ?", [indexKey, data.rows.item(i).key], function(tx, data) {
                                        addIndexEntry(i + 1);
                                    }, error);
                                }
                                catch (e) {
                                    // Not a valid value to insert into index, so just continue
                                    addIndexEntry(i + 1);
                                }
                            }
                            else {
                                success(store);
                            }
                        }
                    }, error);
                }, error);
            }

            if (columnExists) {
                // For a previously existing index, just update the index entries in the existing column
                applyIndex(tx);
            }
            else {
                // For a new index, add a new column to the object store, then apply the index
                var sql = ["ALTER TABLE", idbModules.util.quote(store.name), "ADD", idbModules.util.quote(index.name), "BLOB"].join(" ");
                idbModules.DEBUG && console.log(sql);
                tx.executeSql(sql, [], applyIndex, error);
            }
        });
    };

    /**
     * Deletes an index from an object store.
     * @param {IDBObjectStore} store
     * @param {IDBIndex} index
     * @protected
     */
    IDBIndex.__deleteIndex = function(store, index) {
        // Remove the index from the IDBObjectStore
        store.__indexes[index.name].__deleted = true;
        store.indexNames.splice(store.indexNames.indexOf(index.name), 1);

        // Remove the index in WebSQL
        var transaction = store.transaction;
        transaction.__addToTransactionQueue(function createIndex(tx, args, success, failure) {
            function error(tx, err) {
                failure(idbModules.util.createDOMException(0, "Could not delete index \"" + index.name + "\"", err));
            }

            // Update the object store's index list
            IDBIndex.__updateIndexList(store, tx, success, error);
        });
    };

    /**
     * Updates index list for the given object store.
     * @param {IDBObjectStore} store
     * @param {object} tx
     * @param {function} success
     * @param {function} failure
     */
    IDBIndex.__updateIndexList = function(store, tx, success, failure) {
        var indexList = {};
        for (var i = 0; i < store.indexNames.length; i++) {
            var idx = store.__indexes[store.indexNames[i]];
            /** @type {IDBIndexProperties} **/
            indexList[idx.name] = {
                columnName: idx.name,
                keyPath: idx.keyPath,
                optionalParams: {
                    unique: idx.unique,
                    multiEntry: idx.multiEntry
                },
                deleted: !!idx.deleted
            };
        }

        idbModules.DEBUG && console.log("Updating the index list for " + store.name, indexList);
        tx.executeSql("UPDATE __sys__ set indexList = ? where name = ?", [JSON.stringify(indexList), store.name], function() {
            success(store);
        }, failure);
    };

    /**
     * Retrieves index data for the given key
     * @param {*|IDBKeyRange} key
     * @param {string} opType
     * @returns {IDBRequest}
     * @private
     */
    IDBIndex.prototype.__fetchIndexData = function(key, opType) {
        var me = this;
        var hasKey, encodedKey;

        // key is optional
        if (arguments.length === 1) {
            opType = key;
            hasKey = false;
        }
        else {
            idbModules.Key.validate(key);
            encodedKey = idbModules.Key.encode(key, me.multiEntry);
            hasKey = true;
        }

        return me.objectStore.transaction.__addToTransactionQueue(function fetchIndexData(tx, args, success, error) {
            var sql = ["SELECT * FROM", idbModules.util.quote(me.objectStore.name), "WHERE", idbModules.util.quote(me.name), "NOT NULL"];
            var sqlValues = [];
            if (hasKey) {
                if (me.multiEntry) {
                    sql.push("AND", idbModules.util.quote(me.name), "LIKE ?");
                    sqlValues.push("%" + encodedKey + "%");
                }
                else {
                    sql.push("AND", idbModules.util.quote(me.name), "= ?");
                    sqlValues.push(encodedKey);
                }
            }
            idbModules.DEBUG && console.log("Trying to fetch data for Index", sql.join(" "), sqlValues);
            tx.executeSql(sql.join(" "), sqlValues, function(tx, data) {
                var recordCount = 0, record = null;
                if (me.multiEntry) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var row = data.rows.item(i);
                        var rowKey = idbModules.Key.decode(row[me.name]);
                        if (hasKey && idbModules.Key.isMultiEntryMatch(encodedKey, row[me.name])) {
                            recordCount++;
                            record = record || row;
                        }
                        else if (!hasKey && rowKey !== undefined) {
                            recordCount = recordCount + (rowKey instanceof Array ? rowKey.length : 1);
                            record = record || row;
                        }
                    }
                }
                else {
                    recordCount = data.rows.length;
                    record = recordCount && data.rows.item(0);
                }

                if (opType === "count") {
                    success(recordCount);
                }
                else if (recordCount === 0) {
                    success(undefined);
                }
                else if (opType === "key") {
                    success(idbModules.Key.decode(record.key));
                }
                else { // when opType is value
                    success(idbModules.Sca.decode(record.value));
                }
            }, error);
        });
    };

    /**
     * Opens a cursor over the given key range.
     * @param {IDBKeyRange} range
     * @param {string} direction
     * @returns {IDBRequest}
     */
    IDBIndex.prototype.openCursor = function(range, direction) {
        return new idbModules.IDBCursor(range, direction, this.objectStore, this, this.name, "value").__req;
    };

    /**
     * Opens a cursor over the given key range.  The cursor only includes key values, not data.
     * @param {IDBKeyRange} range
     * @param {string} direction
     * @returns {IDBRequest}
     */
    IDBIndex.prototype.openKeyCursor = function(range, direction) {
        return new idbModules.IDBCursor(range, direction, this.objectStore, this, this.name, "key").__req;
    };

    IDBIndex.prototype.get = function(key) {
        if (arguments.length === 0) {
            throw new TypeError("No key was specified");
        }

        return this.__fetchIndexData(key, "value");
    };

    IDBIndex.prototype.getKey = function(key) {
        if (arguments.length === 0) {
            throw new TypeError("No key was specified");
        }

        return this.__fetchIndexData(key, "key");
    };

    IDBIndex.prototype.count = function(key) {
        // key is optional
        if (key === undefined) {
            return this.__fetchIndexData("count");
        }
        else if (key instanceof idbModules.IDBKeyRange) {
            return new idbModules.IDBCursor(key, "next", this.objectStore, this, this.name, "value", true).__req;
        }
        else {
            return this.__fetchIndexData(key, "count");
        }
    };

    idbModules.IDBIndex = IDBIndex;
}(idbModules));

(function(idbModules) {
    'use strict';

    /**
     * IndexedDB Object Store
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBObjectStore
     * @param {IDBObjectStoreProperties} storeProperties
     * @param {IDBTransaction} transaction
     * @constructor
     */
    function IDBObjectStore(storeProperties, transaction) {
        this.name = storeProperties.name;
        this.keyPath = JSON.parse(storeProperties.keyPath);
        this.transaction = transaction;

        // autoInc is numeric (0/1) on WinPhone
        this.autoIncrement = typeof storeProperties.autoInc === "string" ? storeProperties.autoInc === "true" : !!storeProperties.autoInc;

        this.__indexes = {};
        this.indexNames = new idbModules.util.StringList();
        var indexList = JSON.parse(storeProperties.indexList);
        for (var indexName in indexList) {
            if (indexList.hasOwnProperty(indexName)) {
                var index = new idbModules.IDBIndex(this, indexList[indexName]);
                this.__indexes[index.name] = index;
                if (!index.__deleted) {
                    this.indexNames.push(index.name);
                }
            }
        }
    }

    /**
     * Clones an IDBObjectStore instance for a different IDBTransaction instance.
     * @param {IDBObjectStore} store
     * @param {IDBTransaction} transaction
     * @protected
     */
    IDBObjectStore.__clone = function(store, transaction) {
        var newStore = new IDBObjectStore({
            name: store.name,
            keyPath: JSON.stringify(store.keyPath),
            autoInc: JSON.stringify(store.autoIncrement),
            indexList: "{}"
        }, transaction);
        newStore.__indexes = store.__indexes;
        newStore.indexNames = store.indexNames;
        return newStore;
    };

    /**
     * Creates a new object store in the database.
     * @param {IDBDatabase} db
     * @param {IDBObjectStore} store
     * @protected
     */
    IDBObjectStore.__createObjectStore = function(db, store) {
        // Add the object store to the IDBDatabase
        db.__objectStores[store.name] = store;
        db.objectStoreNames.push(store.name);

        // Add the object store to WebSQL
        var transaction = db.__versionTransaction;
        idbModules.IDBTransaction.__assertVersionChange(transaction);
        transaction.__addToTransactionQueue(function createObjectStore(tx, args, success, failure) {
            function error(tx, err) {
                throw idbModules.util.createDOMException(0, "Could not create object store \"" + store.name + "\"", err);
            }

            //key INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE
            var sql = ["CREATE TABLE", idbModules.util.quote(store.name), "(key BLOB", store.autoIncrement ? "UNIQUE, inc INTEGER PRIMARY KEY AUTOINCREMENT" : "PRIMARY KEY", ", value BLOB)"].join(" ");
            idbModules.DEBUG && console.log(sql);
            tx.executeSql(sql, [], function(tx, data) {
                tx.executeSql("INSERT INTO __sys__ VALUES (?,?,?,?)", [store.name, JSON.stringify(store.keyPath), store.autoIncrement, "{}"], function() {
                    success(store);
                }, error);
            }, error);
        });
    };

    /**
     * Deletes an object store from the database.
     * @param {IDBDatabase} db
     * @param {IDBObjectStore} store
     * @protected
     */
    IDBObjectStore.__deleteObjectStore = function(db, store) {
        // Remove the object store from the IDBDatabase
        db.__objectStores[store.name] = undefined;
        db.objectStoreNames.splice(db.objectStoreNames.indexOf(store.name), 1);

        // Remove the object store from WebSQL
        var transaction = db.__versionTransaction;
        idbModules.IDBTransaction.__assertVersionChange(transaction);
        transaction.__addToTransactionQueue(function deleteObjectStore(tx, args, success, failure) {
            function error(tx, err) {
                failure(idbModules.util.createDOMException(0, "Could not delete ObjectStore", err));
            }

            tx.executeSql("SELECT * FROM __sys__ where name = ?", [store.name], function(tx, data) {
                if (data.rows.length > 0) {
                    tx.executeSql("DROP TABLE " + idbModules.util.quote(store.name), [], function() {
                        tx.executeSql("DELETE FROM __sys__ WHERE name = ?", [store.name], function() {
                            success();
                        }, error);
                    }, error);
                }
            });
        });
    };

    /**
     * Determines whether the given inline or out-of-line key is valid, according to the object store's schema.
     * @param {*} value     Used for inline keys
     * @param {*} key       Used for out-of-line keys
     * @private
     */
    IDBObjectStore.prototype.__validateKey = function(value, key) {
        if (this.keyPath) {
            if (typeof key !== "undefined") {
                throw idbModules.util.createDOMException("DataError", "The object store uses in-line keys and the key parameter was provided", this);
            }
            else if (value && typeof value === "object") {
                key = idbModules.Key.getValue(value, this.keyPath);
                if (key === undefined) {
                    if (this.autoIncrement) {
                        // A key will be generated
                        return;
                    }
                    else {
                        throw idbModules.util.createDOMException("DataError", "Could not eval key from keyPath");
                    }
                }
            }
            else {
                throw idbModules.util.createDOMException("DataError", "KeyPath was specified, but value was not an object");
            }
        }
        else {
            if (typeof key === "undefined") {
                if (this.autoIncrement) {
                    // A key will be generated
                    return;
                }
                else {
                    throw idbModules.util.createDOMException("DataError", "The object store uses out-of-line keys and has no key generator and the key parameter was not provided. ", this);
                }
            }
        }

        idbModules.Key.validate(key);
    };

    /**
     * From the store properties and object, extracts the value for the key in hte object Store
     * If the table has auto increment, get the next in sequence
     * @param {Object} tx
     * @param {Object} value
     * @param {Object} key
     * @param {function} success
     * @param {function} failure
     */
    IDBObjectStore.prototype.__deriveKey = function(tx, value, key, success, failure) {
        var me = this;

        function getNextAutoIncKey(callback) {
            tx.executeSql("SELECT * FROM sqlite_sequence where name like ?", [me.name], function(tx, data) {
                if (data.rows.length !== 1) {
                    callback(1);
                }
                else {
                    callback(data.rows.item(0).seq + 1);
                }
            }, function(tx, error) {
                failure(idbModules.util.createDOMException("DataError", "Could not get the auto increment value for key", error));
            });
        }

        if (me.keyPath) {
            var primaryKey = idbModules.Key.getValue(value, me.keyPath);
            if (primaryKey === undefined && me.autoIncrement) {
                getNextAutoIncKey(function(primaryKey) {
                    try {
                        // Update the value with the new key
                        idbModules.Key.setValue(value, me.keyPath, primaryKey);
                        success(primaryKey);
                    }
                    catch (e) {
                        failure(idbModules.util.createDOMException("DataError", "Could not assign a generated value to the keyPath", e));
                    }
                });
            }
            else {
                success(primaryKey);
            }
        }
        else {
            if (typeof key === "undefined" && me.autoIncrement) {
                // Looks like this has autoInc, so lets get the next in sequence and return that.
                getNextAutoIncKey(success);
            }
            else {
                success(key);
            }
        }
    };

    IDBObjectStore.prototype.__insertData = function(tx, encoded, value, primaryKey, success, error) {
        try {
            var paramMap = {};
            if (typeof primaryKey !== "undefined") {
                idbModules.Key.validate(primaryKey);
                paramMap.key = idbModules.Key.encode(primaryKey);
            }
            for (var i = 0; i < this.indexNames.length; i++) {
                var index = this.__indexes[this.indexNames[i]];
                paramMap[index.name] = idbModules.Key.encode(idbModules.Key.getValue(value, index.keyPath), index.multiEntry);
            }
            var sqlStart = ["INSERT INTO ", idbModules.util.quote(this.name), "("];
            var sqlEnd = [" VALUES ("];
            var sqlValues = [];
            for (var key in paramMap) {
                sqlStart.push(idbModules.util.quote(key) + ",");
                sqlEnd.push("?,");
                sqlValues.push(paramMap[key]);
            }
            // removing the trailing comma
            sqlStart.push("value )");
            sqlEnd.push("?)");
            sqlValues.push(encoded);

            var sql = sqlStart.join(" ") + sqlEnd.join(" ");

            idbModules.DEBUG && console.log("SQL for adding", sql, sqlValues);
            tx.executeSql(sql, sqlValues, function(tx, data) {
                idbModules.Sca.encode(primaryKey, function(primaryKey) {
                    primaryKey = idbModules.Sca.decode(primaryKey);
                    success(primaryKey);
                });
            }, function(tx, err) {
                error(idbModules.util.createDOMError("ConstraintError", err.message, err));
            });
        }
        catch (e) {
            error(e);
        }
    };

    IDBObjectStore.prototype.add = function(value, key) {
        var me = this;
        if (arguments.length === 0) {
            throw new TypeError("No value was specified");
        }
        this.__validateKey(value, key);
        me.transaction.__assertWritable();

        var request = me.transaction.__createRequest();
        me.transaction.__pushToQueue(request, function objectStoreAdd(tx, args, success, error) {
            me.__deriveKey(tx, value, key, function(primaryKey) {
                idbModules.Sca.encode(value, function(encoded) {
                    me.__insertData(tx, encoded, value, primaryKey, success, error);
                });
            }, error);
        });
        return request;
    };

    IDBObjectStore.prototype.put = function(value, key) {
        var me = this;
        if (arguments.length === 0) {
            throw new TypeError("No value was specified");
        }
        this.__validateKey(value, key);
        me.transaction.__assertWritable();

        var request = me.transaction.__createRequest();
        me.transaction.__pushToQueue(request, function objectStorePut(tx, args, success, error) {
            me.__deriveKey(tx, value, key, function(primaryKey) {
                idbModules.Sca.encode(value, function(encoded) {
                    // First try to delete if the record exists
                    idbModules.Key.validate(primaryKey);
                    var sql = "DELETE FROM " + idbModules.util.quote(me.name) + " where key = ?";
                    tx.executeSql(sql, [idbModules.Key.encode(primaryKey)], function(tx, data) {
                        idbModules.DEBUG && console.log("Did the row with the", primaryKey, "exist? ", data.rowsAffected);
                        me.__insertData(tx, encoded, value, primaryKey, success, error);
                    }, function(tx, err) {
                        error(err);
                    });
                });
            }, error);
        });
        return request;
    };

    IDBObjectStore.prototype.get = function(key) {
        // TODO Key should also be a key range
        var me = this;

        if (arguments.length === 0) {
            throw new TypeError("No key was specified");
        }

        idbModules.Key.validate(key);
        var primaryKey = idbModules.Key.encode(key);
        return me.transaction.__addToTransactionQueue(function objectStoreGet(tx, args, success, error) {
            idbModules.DEBUG && console.log("Fetching", me.name, primaryKey);
            tx.executeSql("SELECT * FROM " + idbModules.util.quote(me.name) + " where key = ?", [primaryKey], function(tx, data) {
                idbModules.DEBUG && console.log("Fetched data", data);
                var value;
                try {
                    // Opera can't deal with the try-catch here.
                    if (0 === data.rows.length) {
                        return success();
                    }

                    value = idbModules.Sca.decode(data.rows.item(0).value);
                }
                catch (e) {
                    // If no result is returned, or error occurs when parsing JSON
                    idbModules.DEBUG && console.log(e);
                }
                success(value);
            }, function(tx, err) {
                error(err);
            });
        });
    };

    IDBObjectStore.prototype["delete"] = function(key) {
        var me = this;

        if (arguments.length === 0) {
            throw new TypeError("No key was specified");
        }

        me.transaction.__assertWritable();
        idbModules.Key.validate(key);
        var primaryKey = idbModules.Key.encode(key);
        // TODO key should also support key ranges
        return me.transaction.__addToTransactionQueue(function objectStoreDelete(tx, args, success, error) {
            idbModules.DEBUG && console.log("Fetching", me.name, primaryKey);
            tx.executeSql("DELETE FROM " + idbModules.util.quote(me.name) + " where key = ?", [primaryKey], function(tx, data) {
                idbModules.DEBUG && console.log("Deleted from database", data.rowsAffected);
                success();
            }, function(tx, err) {
                error(err);
            });
        });
    };

    IDBObjectStore.prototype.clear = function() {
        var me = this;
        me.transaction.__assertWritable();
        return me.transaction.__addToTransactionQueue(function objectStoreClear(tx, args, success, error) {
            tx.executeSql("DELETE FROM " + idbModules.util.quote(me.name), [], function(tx, data) {
                idbModules.DEBUG && console.log("Cleared all records from database", data.rowsAffected);
                success();
            }, function(tx, err) {
                error(err);
            });
        });
    };

    IDBObjectStore.prototype.count = function(key) {
        if (key instanceof idbModules.IDBKeyRange) {
            return new idbModules.IDBCursor(key, "next", this, this, "key", "value", true).__req;
        }
        else {
            var me = this;
            var hasKey = false;

            // key is optional
            if (key !== undefined) {
                hasKey = true;
                idbModules.Key.validate(key);
            }

            return me.transaction.__addToTransactionQueue(function objectStoreCount(tx, args, success, error) {
                var sql = "SELECT * FROM " + idbModules.util.quote(me.name) + (hasKey ? " WHERE key = ?" : "");
                var sqlValues = [];
                hasKey && sqlValues.push(idbModules.Key.encode(key));
                tx.executeSql(sql, sqlValues, function(tx, data) {
                    success(data.rows.length);
                }, function(tx, err) {
                    error(err);
                });
            });
        }
    };

    IDBObjectStore.prototype.openCursor = function(range, direction) {
        return new idbModules.IDBCursor(range, direction, this, this, "key", "value").__req;
    };

    IDBObjectStore.prototype.index = function(indexName) {
        if (arguments.length === 0) {
            throw new TypeError("No index name was specified");
        }
        var index = this.__indexes[indexName];
        if (!index) {
            throw idbModules.util.createDOMException("NotFoundError", "Index \"" + indexName + "\" does not exist on " + this.name);
        }

        return idbModules.IDBIndex.__clone(index, this);
    };

    /**
     * Creates a new index on the object store.
     * @param {string} indexName
     * @param {string} keyPath
     * @param {object} optionalParameters
     * @returns {IDBIndex}
     */
    IDBObjectStore.prototype.createIndex = function(indexName, keyPath, optionalParameters) {
        if (arguments.length === 0) {
            throw new TypeError("No index name was specified");
        }
        if (arguments.length === 1) {
            throw new TypeError("No key path was specified");
        }
        if (keyPath instanceof Array && optionalParameters && optionalParameters.multiEntry) {
            throw idbModules.util.createDOMException("InvalidAccessError", "The keyPath argument was an array and the multiEntry option is true.");
        }
        if (this.__indexes[indexName] && !this.__indexes[indexName].__deleted) {
            throw idbModules.util.createDOMException("ConstraintError", "Index \"" + indexName + "\" already exists on " + this.name);
        }

        this.transaction.__assertVersionChange();

        optionalParameters = optionalParameters || {};
        /** @name IDBIndexProperties **/
        var indexProperties = {
            columnName: indexName,
            keyPath: keyPath,
            optionalParams: {
                unique: !!optionalParameters.unique,
                multiEntry: !!optionalParameters.multiEntry
            }
        };
        var index = new idbModules.IDBIndex(this, indexProperties);
        idbModules.IDBIndex.__createIndex(this, index);
        return index;
    };

    IDBObjectStore.prototype.deleteIndex = function(indexName) {
        if (arguments.length === 0) {
            throw new TypeError("No index name was specified");
        }
        var index = this.__indexes[indexName];
        if (!index) {
            throw idbModules.util.createDOMException("NotFoundError", "Index \"" + indexName + "\" does not exist on " + this.name);
        }
        this.transaction.__assertVersionChange();

        idbModules.IDBIndex.__deleteIndex(this, index);
    };

    idbModules.IDBObjectStore = IDBObjectStore;
}(idbModules));

(function(idbModules) {
    'use strict';

    var uniqueID = 0;

    /**
     * The IndexedDB Transaction
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBTransaction
     * @param {IDBDatabase} db
     * @param {string[]} storeNames
     * @param {string} mode
     * @constructor
     */
    function IDBTransaction(db, storeNames, mode) {
        this.__id = ++uniqueID; // for debugging simultaneous transactions
        this.__active = true;
        this.__running = false;
        this.__errored = false;
        this.__requests = [];
        this.__storeNames = storeNames;
        this.mode = mode;
        this.db = db;
        this.error = null;
        this.onabort = this.onerror = this.oncomplete = null;

        // Kick off the transaction as soon as all synchronous code is done.
        var me = this;
        setTimeout(function() { me.__executeRequests(); }, 0);
    }

    IDBTransaction.prototype.__executeRequests = function() {
        if (this.__running) {
            idbModules.DEBUG && console.log("Looks like the request set is already running", this.mode);
            return;
        }

        this.__running = true;
        var me = this;

        me.db.__db.transaction(function executeRequests(tx) {
                me.__tx = tx;
                var q = null, i = 0;

                function success(result, req) {
                    if (req) {
                        q.req = req;// Need to do this in case of cursors
                    }
                    q.req.readyState = "done";
                    q.req.result = result;
                    delete q.req.error;
                    var e = idbModules.util.createEvent("success");
                    idbModules.util.callback("onsuccess", q.req, e);
                    i++;
                    executeNextRequest();
                }

                function error(tx, err) {
                    err = idbModules.util.findError(arguments);
                    try {
                        // Fire an error event for the current IDBRequest
                        q.req.readyState = "done";
                        q.req.error = err || "DOMError";
                        q.req.result = undefined;
                        var e = idbModules.util.createEvent("error", err);
                        idbModules.util.callback("onerror", q.req, e);
                    }
                    finally {
                        // Fire an error event for the transaction
                        transactionError(err);
                    }
                }

                function executeNextRequest() {
                    if (i >= me.__requests.length) {
                        // All requests in the transaction are done
                        me.__requests = [];
                        if (me.__active) {
                            me.__active = false;
                            transactionFinished();
                        }
                    }
                    else {
                        try {
                            q = me.__requests[i];
                            q.op(tx, q.args, success, error);
                        }
                        catch (e) {
                            error(e);
                        }
                    }
                }

                executeNextRequest();
            },

            function webSqlError(err) {
                transactionError(err);
            }
        );

        function transactionError(err) {
            idbModules.util.logError("Error", "An error occurred in a transaction", err);

            if (me.__errored) {
                // We've already called "onerror", "onabort", or thrown, so don't do it again.
                return;
            }

            me.__errored = true;

            if (!me.__active) {
                // The transaction has already completed, so we can't call "onerror" or "onabort".
                // So throw the error instead.
                throw err;
            }

            try {
                me.error = err;
                var evt = idbModules.util.createEvent("error");
                idbModules.util.callback("onerror", me, evt);
                idbModules.util.callback("onerror", me.db, evt);
            }
            finally {
                me.abort();
            }
        }

        function transactionFinished() {
            idbModules.DEBUG && console.log("Transaction completed");
            var evt = idbModules.util.createEvent("complete");
            try {
                idbModules.util.callback("oncomplete", me, evt);
                idbModules.util.callback("__oncomplete", me, evt);
            }
            catch (e) {
                // An error occurred in the "oncomplete" handler.
                // It's too late to call "onerror" or "onabort". Throw a global error instead.
                // (this may seem odd/bad, but it's how all native IndexedDB implementations work)
                me.__errored = true;
                throw e;
            }
        }
    };

    /**
     * Creates a new IDBRequest for the transaction.
     * NOTE: The transaction is not queued util you call {@link IDBTransaction#__pushToQueue}
     * @returns {IDBRequest}
     * @protected
     */
    IDBTransaction.prototype.__createRequest = function() {
        var request = new idbModules.IDBRequest();
        request.source = this.db;
        request.transaction = this;
        return request;
    };

    /**
     * Adds a callback function to the transaction queue
     * @param {function} callback
     * @param {*} args
     * @returns {IDBRequest}
     * @protected
     */
    IDBTransaction.prototype.__addToTransactionQueue = function(callback, args) {
        var request = this.__createRequest();
        this.__pushToQueue(request, callback, args);
        return request;
    };

    /**
     * Adds an IDBRequest to the transaction queue
     * @param {IDBRequest} request
     * @param {function} callback
     * @param {*} args
     * @protected
     */
    IDBTransaction.prototype.__pushToQueue = function(request, callback, args) {
        this.__assertActive();
        this.__requests.push({
            "op": callback,
            "args": args,
            "req": request
        });
    };

    IDBTransaction.prototype.__assertActive = function() {
        if (!this.__active) {
            throw idbModules.util.createDOMException("TransactionInactiveError", "A request was placed against a transaction which is currently not active, or which is finished");
        }
    };

    IDBTransaction.prototype.__assertWritable = function() {
        if (this.mode === IDBTransaction.READ_ONLY) {
            throw idbModules.util.createDOMException("ReadOnlyError", "The transaction is read only");
        }
    };

    IDBTransaction.prototype.__assertVersionChange = function() {
        IDBTransaction.__assertVersionChange(this);
    };

    IDBTransaction.__assertVersionChange = function(tx) {
        if (!tx || tx.mode !== IDBTransaction.VERSION_CHANGE) {
            throw idbModules.util.createDOMException("InvalidStateError", "Not a version transaction");
        }
    };

    /**
     * Returns the specified object store.
     * @param {string} objectStoreName
     * @returns {IDBObjectStore}
     */
    IDBTransaction.prototype.objectStore = function(objectStoreName) {
        if (arguments.length === 0) {
            throw new TypeError("No object store name was specified");
        }
        if (!this.__active) {
            throw idbModules.util.createDOMException("InvalidStateError", "A request was placed against a transaction which is currently not active, or which is finished");
        }
        if (this.__storeNames.indexOf(objectStoreName) === -1 && this.mode !== IDBTransaction.VERSION_CHANGE) {
            throw idbModules.util.createDOMException("NotFoundError", objectStoreName + " is not participating in this transaction");
        }
        var store = this.db.__objectStores[objectStoreName];
        if (!store) {
            throw idbModules.util.createDOMException("NotFoundError", objectStoreName + " does not exist in " + this.db.name);
        }

        return idbModules.IDBObjectStore.__clone(store, this);
    };

    IDBTransaction.prototype.abort = function() {
        var me = this;
        idbModules.DEBUG && console.log("The transaction was aborted", me);
        me.__active = false;
        var evt = idbModules.util.createEvent("abort");

        // Fire the "onabort" event asynchronously, so errors don't bubble
        setTimeout(function() {
            idbModules.util.callback("onabort", me, evt);
        }, 0);
    };

    IDBTransaction.READ_ONLY = "readonly";
    IDBTransaction.READ_WRITE = "readwrite";
    IDBTransaction.VERSION_CHANGE = "versionchange";

    idbModules.IDBTransaction = IDBTransaction;
}(idbModules));

(function(idbModules){
    'use strict';

    /**
     * IDB Database Object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#database-interface
     * @constructor
     */
    function IDBDatabase(db, name, version, storeProperties){
        this.__db = db;
        this.__closed = false;
        this.version = version;
        this.name = name;
        this.onabort = this.onerror = this.onversionchange = null;

        this.__objectStores = {};
        this.objectStoreNames = new idbModules.util.StringList();
        for (var i = 0; i < storeProperties.rows.length; i++) {
            var store = new idbModules.IDBObjectStore(storeProperties.rows.item(i));
            this.__objectStores[store.name] = store;
            this.objectStoreNames.push(store.name);
        }
    }

    /**
     * Creates a new object store.
     * @param {string} storeName
     * @param {object} [createOptions]
     * @returns {IDBObjectStore}
     */
    IDBDatabase.prototype.createObjectStore = function(storeName, createOptions){
        if (arguments.length === 0) {
            throw new TypeError("No object store name was specified");
        }
        if (this.__objectStores[storeName]) {
            throw idbModules.util.createDOMException("ConstraintError", "Object store \"" + storeName + "\" already exists in " + this.name);
        }
        this.__versionTransaction.__assertVersionChange();

        createOptions = createOptions || {};
        /** @name IDBObjectStoreProperties **/
        var storeProperties = {
            name: storeName,
            keyPath: JSON.stringify(createOptions.keyPath || null),
            autoInc: JSON.stringify(createOptions.autoIncrement),
            indexList: "{}"
        };
        var store = new idbModules.IDBObjectStore(storeProperties, this.__versionTransaction);
        idbModules.IDBObjectStore.__createObjectStore(this, store);
        return store;
    };

    /**
     * Deletes an object store.
     * @param {string} storeName
     */
    IDBDatabase.prototype.deleteObjectStore = function(storeName){
        if (arguments.length === 0) {
            throw new TypeError("No object store name was specified");
        }
        var store = this.__objectStores[storeName];
        if (!store) {
            throw idbModules.util.createDOMException("NotFoundError", "Object store \"" + storeName + "\" does not exist in " + this.name);
        }
        this.__versionTransaction.__assertVersionChange();

        idbModules.IDBObjectStore.__deleteObjectStore(this, store);
    };

    IDBDatabase.prototype.close = function(){
        this.__closed = true;
    };

    /**
     * Starts a new transaction.
     * @param {string|string[]} storeNames
     * @param {string} mode
     * @returns {IDBTransaction}
     */
    IDBDatabase.prototype.transaction = function(storeNames, mode){
        if (this.__closed) {
            throw idbModules.util.createDOMException("InvalidStateError", "An attempt was made to start a new transaction on a database connection that is not open");
        }

        if (typeof mode === "number") {
            mode = mode === 1 ? IDBTransaction.READ_WRITE : IDBTransaction.READ_ONLY;
            idbModules.DEBUG && console.log("Mode should be a string, but was specified as ", mode);
        }
        else {
            mode = mode || IDBTransaction.READ_ONLY;
        }

        if (mode !== IDBTransaction.READ_ONLY && mode !== IDBTransaction.READ_WRITE) {
            throw new TypeError("Invalid transaction mode: " + mode);
        }

        storeNames = typeof storeNames === "string" ? [storeNames] : storeNames;
        if (storeNames.length === 0) {
            throw idbModules.util.createDOMException("InvalidAccessError", "No object store names were specified");
        }
        for (var i = 0; i < storeNames.length; i++) {
            if (!this.objectStoreNames.contains(storeNames[i])) {
                throw idbModules.util.createDOMException("NotFoundError", "The \"" + storeNames[i] + "\" object store does not exist");
            }
        }

        var transaction = new idbModules.IDBTransaction(this, storeNames, mode);
        return transaction;
    };
    
    idbModules.IDBDatabase = IDBDatabase;
}(idbModules));

(function(idbModules) {
    'use strict';

    var DEFAULT_DB_SIZE = 4 * 1024 * 1024;
    var sysdb;

    /**
     * Craetes the sysDB to keep track of version numbers for databases
     **/
    function createSysDB(success, failure) {
        function sysDbCreateError(tx, err) {
            err = idbModules.util.findError(arguments);
            idbModules.DEBUG && console.log("Error in sysdb transaction - when creating dbVersions", err);
            failure(err);
        }

        if (sysdb) {
            success();
        }
        else {
            sysdb = window.openDatabase("__sysdb__", 1, "System Database", DEFAULT_DB_SIZE);
            sysdb.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS dbVersions (name VARCHAR(255), version INT);", [], success, sysDbCreateError);
            }, sysDbCreateError);
        }
    }

    /**
     * IDBFactory Class
     * https://w3c.github.io/IndexedDB/#idl-def-IDBFactory
     * @constructor
     */
    function IDBFactory() {
        this.modules = idbModules;
    }

    /**
     * The IndexedDB Method to create a new database and return the DB
     * @param {string} name
     * @param {number} version
     */
    IDBFactory.prototype.open = function(name, version) {
        var req = new idbModules.IDBOpenDBRequest();
        var calledDbCreateError = false;

        if (arguments.length === 0) {
            throw new TypeError('Database name is required');
        }
        else if (arguments.length === 2) {
            version = parseFloat(version);
            if (isNaN(version) || !isFinite(version) || version <= 0) {
                throw new TypeError('Invalid database version: ' + version);
            }
        }
        name = name + ''; // cast to a string

        function dbCreateError(tx, err) {
            if (calledDbCreateError) {
                return;
            }
            err = idbModules.util.findError(arguments);
            calledDbCreateError = true;
            var evt = idbModules.util.createEvent("error", arguments);
            req.readyState = "done";
            req.error = err || "DOMError";
            idbModules.util.callback("onerror", req, evt);
        }

        function openDB(oldVersion) {
            var db = window.openDatabase(name, 1, name, DEFAULT_DB_SIZE);
            req.readyState = "done";
            if (typeof version === "undefined") {
                version = oldVersion || 1;
            }
            if (version <= 0 || oldVersion > version) {
                var err = idbModules.util.createDOMError("VersionError", "An attempt was made to open a database using a lower version than the existing version.", version);
                dbCreateError(err);
                return;
            }

            db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS __sys__ (name VARCHAR(255), keyPath VARCHAR(255), autoInc BOOLEAN, indexList BLOB)", [], function() {
                    tx.executeSql("SELECT * FROM __sys__", [], function(tx, data) {
                        var e = idbModules.util.createEvent("success");
                        req.source = req.result = new idbModules.IDBDatabase(db, name, version, data);
                        if (oldVersion < version) {
                            // DB Upgrade in progress
                            sysdb.transaction(function(systx) {
                                systx.executeSql("UPDATE dbVersions set version = ? where name = ?", [version, name], function() {
                                    var e = idbModules.util.createEvent("upgradeneeded");
                                    e.oldVersion = oldVersion;
                                    e.newVersion = version;
                                    req.transaction = req.result.__versionTransaction = new idbModules.IDBTransaction(req.source, [], idbModules.IDBTransaction.VERSION_CHANGE);
                                    req.transaction.__addToTransactionQueue(function onupgradeneeded(tx, args, success) {
                                        idbModules.util.callback("onupgradeneeded", req, e);
                                        success();
                                    });
                                    req.transaction.__oncomplete = function() {
                                        req.transaction = null;
                                        var e = idbModules.util.createEvent("success");
                                        idbModules.util.callback("onsuccess", req, e);
                                    };
                                }, dbCreateError);
                            }, dbCreateError);
                        } else {
                            idbModules.util.callback("onsuccess", req, e);
                        }
                    }, dbCreateError);
                }, dbCreateError);
            }, dbCreateError);
        }

        createSysDB(function() {
            sysdb.transaction(function(tx) {
                tx.executeSql("SELECT * FROM dbVersions where name = ?", [name], function(tx, data) {
                    if (data.rows.length === 0) {
                        // Database with this name does not exist
                        tx.executeSql("INSERT INTO dbVersions VALUES (?,?)", [name, version || 1], function() {
                            openDB(0);
                        }, dbCreateError);
                    } else {
                        openDB(data.rows.item(0).version);
                    }
                }, dbCreateError);
            }, dbCreateError);
        }, dbCreateError);

        return req;
    };

    /**
     * Deletes a database
     * @param {string} name
     * @returns {IDBOpenDBRequest}
     */
    IDBFactory.prototype.deleteDatabase = function(name) {
        var req = new idbModules.IDBOpenDBRequest();
        var calledDBError = false;
        var version = null;

        if (arguments.length === 0) {
            throw new TypeError('Database name is required');
        }
        name = name + ''; // cast to a string

        function dbError(tx, err) {
            if (calledDBError) {
                return;
            }
            err = idbModules.util.findError(arguments);
            req.readyState = "done";
            req.error = err || "DOMError";
            var e = idbModules.util.createEvent("error");
            e.debug = arguments;
            idbModules.util.callback("onerror", req, e);
            calledDBError = true;
        }

        function deleteFromDbVersions() {
            sysdb.transaction(function(systx) {
                systx.executeSql("DELETE FROM dbVersions where name = ? ", [name], function() {
                    req.result = undefined;
                    var e = idbModules.util.createEvent("success");
                    e.newVersion = null;
                    e.oldVersion = version;
                    idbModules.util.callback("onsuccess", req, e);
                }, dbError);
            }, dbError);
        }

        createSysDB(function() {
            sysdb.transaction(function(systx) {
                systx.executeSql("SELECT * FROM dbVersions where name = ?", [name], function(tx, data) {
                    if (data.rows.length === 0) {
                        req.result = undefined;
                        var e = idbModules.util.createEvent("success");
                        e.newVersion = null;
                        e.oldVersion = version;
                        idbModules.util.callback("onsuccess", req, e);
                        return;
                    }
                    version = data.rows.item(0).version;
                    var db = window.openDatabase(name, 1, name, DEFAULT_DB_SIZE);
                    db.transaction(function(tx) {
                        tx.executeSql("SELECT * FROM __sys__", [], function(tx, data) {
                            var tables = data.rows;
                            (function deleteTables(i) {
                                if (i >= tables.length) {
                                    // If all tables are deleted, delete the housekeeping tables
                                    tx.executeSql("DROP TABLE IF EXISTS __sys__", [], function() {
                                        // Finally, delete the record for this DB from sysdb
                                        deleteFromDbVersions();
                                    }, dbError);
                                } else {
                                    // Delete all tables in this database, maintained in the sys table
                                    tx.executeSql("DROP TABLE " + idbModules.util.quote(tables.item(i).name), [], function() {
                                        deleteTables(i + 1);
                                    }, function() {
                                        deleteTables(i + 1);
                                    });
                                }
                            }(0));
                        }, function(e) {
                            // __sysdb table does not exist, but that does not mean delete did not happen
                            deleteFromDbVersions();
                        });
                    });
                }, dbError);
            }, dbError);
        }, dbError);

        return req;
    };

    /**
     * Compares two keys
     * @param key1
     * @param key2
     * @returns {number}
     */
    IDBFactory.prototype.cmp = function(key1, key2) {
        if (arguments.length < 2) {
            throw new TypeError("You must provide two keys to be compared");
        }

        idbModules.Key.validate(key1);
        idbModules.Key.validate(key2);
        var encodedKey1 = idbModules.Key.encode(key1);
        var encodedKey2 = idbModules.Key.encode(key2);
        var result = encodedKey1 > encodedKey2 ? 1 : encodedKey1 === encodedKey2 ? 0 : -1;
        
        if (idbModules.DEBUG) {
            // verify that the keys encoded correctly
            var decodedKey1 = idbModules.Key.decode(encodedKey1);
            var decodedKey2 = idbModules.Key.decode(encodedKey2);
            if (typeof key1 === "object") {
                key1 = JSON.stringify(key1);
                decodedKey1 = JSON.stringify(decodedKey1);
            }
            if (typeof key2 === "object") {
                key2 = JSON.stringify(key2);
                decodedKey2 = JSON.stringify(decodedKey2);
            }

            // encoding/decoding mismatches are usually due to a loss of floating-point precision
            if (decodedKey1 !== key1) {
                console.warn(key1 + ' was incorrectly encoded as ' + decodedKey1);
            }
            if (decodedKey2 !== key2) {
                console.warn(key2 + ' was incorrectly encoded as ' + decodedKey2);
            }
        }
        
        return result;
    };


    idbModules.shimIndexedDB = new IDBFactory();
    idbModules.IDBFactory = IDBFactory;
}(idbModules));

(function(window, idbModules){
    'use strict';

    function shim(name, value) {
        try {
            // Try setting the property. This will fail if the property is read-only.
            window[name] = value;
        }
        catch (e) {}

        if (window[name] !== value && Object.defineProperty) {
            // Setting a read-only property failed, so try re-defining the property
            try {
                Object.defineProperty(window, name, {
                    value: value
                });
            }
            catch (e) {}

            if (window[name] !== value) {
                window.console && console.warn && console.warn('Unable to shim ' + name);
            }
        }
    }

    shim('shimIndexedDB', idbModules.shimIndexedDB);
    if (window.shimIndexedDB) {
        window.shimIndexedDB.__useShim = function(){
            if (typeof window.openDatabase !== "undefined") {
                // Polyfill ALL of IndexedDB, using WebSQL
                shim('indexedDB', idbModules.shimIndexedDB);
                shim('IDBFactory', idbModules.IDBFactory);
                shim('IDBDatabase', idbModules.IDBDatabase);
                shim('IDBObjectStore', idbModules.IDBObjectStore);
                shim('IDBIndex', idbModules.IDBIndex);
                shim('IDBTransaction', idbModules.IDBTransaction);
                shim('IDBCursor', idbModules.IDBCursor);
                shim('IDBKeyRange', idbModules.IDBKeyRange);
                shim('IDBRequest', idbModules.IDBRequest);
                shim('IDBOpenDBRequest', idbModules.IDBOpenDBRequest);
                shim('IDBVersionChangeEvent', idbModules.IDBVersionChangeEvent);
            }
            else if (typeof window.indexedDB === "object") {
                // Polyfill the missing IndexedDB features
                idbModules.polyfill();
            }
        };

        window.shimIndexedDB.__debug = function(val){
            idbModules.DEBUG = val;
        };
    }
    
    // Workaround to prevent an error in Firefox
    if(!('indexedDB' in window)) {
        window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    }
    
    // Detect browsers with known IndexedDb issues (e.g. Android pre-4.4)
    var poorIndexedDbSupport = false;
    if (navigator.userAgent.match(/Android 2/) || navigator.userAgent.match(/Android 3/) || navigator.userAgent.match(/Android 4\.[0-3]/)) {
        /* Chrome is an exception. It supports IndexedDb */
        if (!navigator.userAgent.match(/Chrome/)) {
            poorIndexedDbSupport = true;
        }
    }

    if ((typeof window.indexedDB === "undefined" || !window.indexedDB || poorIndexedDbSupport) && typeof window.openDatabase !== "undefined") {
        window.shimIndexedDB.__useShim();
    }
    else {
        window.IDBDatabase = window.IDBDatabase || window.webkitIDBDatabase;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        if(!window.IDBTransaction){
            window.IDBTransaction = {};
        }
        /* Some browsers (e.g. Chrome 18 on Android) support IndexedDb but do not allow writing of these properties */
        try {
            window.IDBTransaction.READ_ONLY = window.IDBTransaction.READ_ONLY || "readonly";
            window.IDBTransaction.READ_WRITE = window.IDBTransaction.READ_WRITE || "readwrite";
        } catch (e) {}
    }
    
}(window, idbModules));


},{}],292:[function(require,module,exports){
// mutationobserver-shim v0.3.1 (github.com/megawac/MutationObserver.js)
// Authors: Graeme Yeates (github.com/megawac) 
window.MutationObserver=window.MutationObserver||window.WebKitMutationObserver||function(r){function w(a){this.g=[];this.k=a}function H(a){(function c(){var d=a.takeRecords();d.length&&a.k(d,a);a.f=setTimeout(c,w._period)})()}function t(a){var b={type:null,target:null,addedNodes:[],removedNodes:[],previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null},c;for(c in a)b[c]!==r&&a[c]!==r&&(b[c]=a[c]);return b}function I(a,b){var c=B(a,b);return function(d){var g=
d.length,n;b.a&&c.a&&A(d,a,c.a,b.d);if(b.b||b.e)n=J(d,a,c,b);if(n||d.length!==g)c=B(a,b)}}function A(a,b,c,d){for(var g={},n=b.attributes,h,m,C=n.length;C--;)h=n[C],m=h.name,d&&d[m]===r||(h.value!==c[m]&&a.push(t({type:"attributes",target:b,attributeName:m,oldValue:c[m],attributeNamespace:h.namespaceURI})),g[m]=!0);for(m in c)g[m]||a.push(t({target:b,type:"attributes",attributeName:m,oldValue:c[m]}))}function J(a,b,c,d){function g(b,c,g,h,y){var r=b.length-1;y=-~((r-y)/2);for(var f,k,e;e=b.pop();)f=
g[e.h],k=h[e.i],d.b&&y&&Math.abs(e.h-e.i)>=r&&(a.push(t({type:"childList",target:c,addedNodes:[f],removedNodes:[f],nextSibling:f.nextSibling,previousSibling:f.previousSibling})),y--),d.a&&k.a&&A(a,f,k.a,d.d),d.c&&3===f.nodeType&&f.nodeValue!==k.c&&a.push(t({type:"characterData",target:f})),d.e&&n(f,k)}function n(b,c){for(var x=b.childNodes,p=c.b,y=x.length,w=p?p.length:0,f,k,e,l,u,z=0,v=0,q=0;v<y||q<w;)l=x[v],u=(e=p[q])&&e.j,l===u?(d.a&&e.a&&A(a,l,e.a,d.d),d.c&&e.c!==r&&l.nodeValue!==e.c&&a.push(t({type:"characterData",
target:l})),k&&g(k,b,x,p,z),d.e&&(l.childNodes.length||e.b&&e.b.length)&&n(l,e),v++,q++):(h=!0,f||(f={},k=[]),l&&(f[e=D(l)]||(f[e]=!0,-1===(e=E(p,l,q,"j"))?d.b&&(a.push(t({type:"childList",target:b,addedNodes:[l],nextSibling:l.nextSibling,previousSibling:l.previousSibling})),z++):k.push({h:v,i:e})),v++),u&&u!==x[v]&&(f[e=D(u)]||(f[e]=!0,-1===(e=E(x,u,v))?d.b&&(a.push(t({type:"childList",target:c.j,removedNodes:[u],nextSibling:p[q+1],previousSibling:p[q-1]})),z--):k.push({h:e,i:q})),q++));k&&g(k,b,
x,p,z)}var h;n(b,c);return h}function B(a,b){var c=!0;return function g(a){var h={j:a};!b.c||3!==a.nodeType&&8!==a.nodeType?(b.a&&c&&1===a.nodeType&&(h.a=F(a.attributes,function(a,c){if(!b.d||b.d[c.name])a[c.name]=c.value;return a})),c&&(b.b||b.c||b.a&&b.e)&&(h.b=K(a.childNodes,g)),c=b.e):h.c=a.nodeValue;return h}(a)}function D(a){try{return a.id||(a.mo_id=a.mo_id||G++)}catch(b){try{return a.nodeValue}catch(c){return G++}}}function K(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d,a);return c}
function F(a,b){for(var c={},d=0;d<a.length;d++)c=b(c,a[d],d,a);return c}function E(a,b,c,d){for(;c<a.length;c++)if((d?a[c][d]:a[c])===b)return c;return-1}w._period=30;w.prototype={observe:function(a,b){for(var c={a:!!(b.attributes||b.attributeFilter||b.attributeOldValue),b:!!b.childList,e:!!b.subtree,c:!(!b.characterData&&!b.characterDataOldValue)},d=this.g,g=0;g<d.length;g++)d[g].m===a&&d.splice(g,1);b.attributeFilter&&(c.d=F(b.attributeFilter,function(a,b){a[b]=!0;return a}));d.push({m:a,l:I(a,
c)});this.f||H(this)},takeRecords:function(){for(var a=[],b=this.g,c=0;c<b.length;c++)b[c].l(a);return a},disconnect:function(){this.g=[];clearTimeout(this.f);this.f=null}};var G=1;return w}(void 0);

},{}],293:[function(require,module,exports){
/*!
 * Object.observe polyfill - v0.2.4
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/object-observe
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */

// Some type definitions
/**
 * This represents the data relative to an observed object
 * @typedef  {Object}                     ObjectData
 * @property {Map<Handler, HandlerData>}  handlers
 * @property {String[]}                   properties
 * @property {*[]}                        values
 * @property {Descriptor[]}               descriptors
 * @property {Notifier}                   notifier
 * @property {Boolean}                    frozen
 * @property {Boolean}                    extensible
 * @property {Object}                     proto
 */
/**
 * Function definition of a handler
 * @callback Handler
 * @param {ChangeRecord[]}                changes
*/
/**
 * This represents the data relative to an observed object and one of its
 * handlers
 * @typedef  {Object}                     HandlerData
 * @property {Map<Object, ObservedData>}  observed
 * @property {ChangeRecord[]}             changeRecords
 */
/**
 * @typedef  {Object}                     ObservedData
 * @property {String[]}                   acceptList
 * @property {ObjectData}                 data
*/
/**
 * Type definition for a change. Any other property can be added using
 * the notify() or performChange() methods of the notifier.
 * @typedef  {Object}                     ChangeRecord
 * @property {String}                     type
 * @property {Object}                     object
 * @property {String}                     [name]
 * @property {*}                          [oldValue]
 * @property {Number}                     [index]
 */
/**
 * Type definition for a notifier (what Object.getNotifier returns)
 * @typedef  {Object}                     Notifier
 * @property {Function}                   notify
 * @property {Function}                   performChange
 */
/**
 * Function called with Notifier.performChange. It may optionally return a
 * ChangeRecord that gets automatically notified, but `type` and `object`
 * properties are overridden.
 * @callback Performer
 * @returns {ChangeRecord|undefined}
 */

Object.observe || (function(O, A, root, _undefined) {
    "use strict";

        /**
         * Relates observed objects and their data
         * @type {Map<Object, ObjectData}
         */
    var observed,
        /**
         * List of handlers and their data
         * @type {Map<Handler, Map<Object, HandlerData>>}
         */
        handlers,

        defaultAcceptList = [ "add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions" ];

    // Functions for internal usage

        /**
         * Checks if the argument is an Array object. Polyfills Array.isArray.
         * @function isArray
         * @param {?*} object
         * @returns {Boolean}
         */
    var isArray = A.isArray || (function(toString) {
            return function (object) { return toString.call(object) === "[object Array]"; };
        })(O.prototype.toString),

        /**
         * Returns the index of an item in a collection, or -1 if not found.
         * Uses the generic Array.indexOf or Array.prototype.indexOf if available.
         * @function inArray
         * @param {Array} array
         * @param {*} pivot           Item to look for
         * @param {Number} [start=0]  Index to start from
         * @returns {Number}
         */
        inArray = A.prototype.indexOf ? A.indexOf || function(array, pivot, start) {
            return A.prototype.indexOf.call(array, pivot, start);
        } : function(array, pivot, start) {
            for (var i = start || 0; i < array.length; i++)
                if (array[i] === pivot)
                    return i;
            return -1;
        },

        /**
         * Returns an instance of Map, or a Map-like object is Map is not
         * supported or doesn't support forEach()
         * @function createMap
         * @returns {Map}
         */
        createMap = root.Map === _undefined || !Map.prototype.forEach ? function() {
            // Lightweight shim of Map. Lacks clear(), entries(), keys() and
            // values() (the last 3 not supported by IE11, so can't use them),
            // it doesn't handle the constructor's argument (like IE11) and of
            // course it doesn't support for...of.
            // Chrome 31-35 and Firefox 13-24 have a basic support of Map, but
            // they lack forEach(), so their native implementation is bad for
            // this polyfill. (Chrome 36+ supports Object.observe.)
            var keys = [], values = [];

            return {
                size: 0,
                has: function(key) { return inArray(keys, key) > -1; },
                get: function(key) { return values[inArray(keys, key)]; },
                set: function(key, value) {
                    var i = inArray(keys, key);
                    if (i === -1) {
                        keys.push(key);
                        values.push(value);
                        this.size++;
                    } else values[i] = value;
                },
                "delete": function(key) {
                    var i = inArray(keys, key);
                    if (i > -1) {
                        keys.splice(i, 1);
                        values.splice(i, 1);
                        this.size--;
                    }
                },
                forEach: function(callback/*, thisObj*/) {
                    for (var i = 0; i < keys.length; i++)
                        callback.call(arguments[1], values[i], keys[i], this);
                }
            };
        } : function() { return new Map(); },

        /**
         * Simple shim for Object.getOwnPropertyNames when is not available
         * Misses checks on object, don't use as a replacement of Object.keys/getOwnPropertyNames
         * @function getProps
         * @param {Object} object
         * @returns {String[]}
         */
        getProps = O.getOwnPropertyNames ? (function() {
            var func = O.getOwnPropertyNames;
            try {
                arguments.callee;
            } catch (e) {
                // Strict mode is supported

                // In strict mode, we can't access to "arguments", "caller" and
                // "callee" properties of functions. Object.getOwnPropertyNames
                // returns [ "prototype", "length", "name" ] in Firefox; it returns
                // "caller" and "arguments" too in Chrome and in Internet
                // Explorer, so those values must be filtered.
                var avoid = (func(inArray).join(" ") + " ").replace(/prototype |length |name /g, "").slice(0, -1).split(" ");
                if (avoid.length) func = function(object) {
                    var props = O.getOwnPropertyNames(object);
                    if (typeof object === "function")
                        for (var i = 0, j; i < avoid.length;)
                            if ((j = inArray(props, avoid[i++])) > -1)
                                props.splice(j, 1);

                    return props;
                };
            }
            return func;
        })() : function(object) {
            // Poor-mouth version with for...in (IE8-)
            var props = [], prop, hop;
            if ("hasOwnProperty" in object) {
                for (prop in object)
                    if (object.hasOwnProperty(prop))
                        props.push(prop);
            } else {
                hop = O.hasOwnProperty;
                for (prop in object)
                    if (hop.call(object, prop))
                        props.push(prop);
            }

            // Inserting a common non-enumerable property of arrays
            if (isArray(object))
                props.push("length");

            return props;
        },

        /**
         * Return the prototype of the object... if defined.
         * @function getPrototype
         * @param {Object} object
         * @returns {Object}
         */
        getPrototype = O.getPrototypeOf,

        /**
         * Return the descriptor of the object... if defined.
         * IE8 supports a (useless) Object.getOwnPropertyDescriptor for DOM
         * nodes only, so defineProperties is checked instead.
         * @function getDescriptor
         * @param {Object} object
         * @param {String} property
         * @returns {Descriptor}
         */
        getDescriptor = O.defineProperties && O.getOwnPropertyDescriptor,

        /**
         * Sets up the next check and delivering iteration, using
         * requestAnimationFrame or a (close) polyfill.
         * @function nextFrame
         * @param {function} func
         * @returns {number}
         */
        nextFrame = root.requestAnimationFrame || root.webkitRequestAnimationFrame || (function() {
            var initial = +new Date,
                last = initial;
            return function(func) {
                return setTimeout(function() {
                    func((last = +new Date) - initial);
                }, 17);
            };
        })(),

        /**
         * Sets up the observation of an object
         * @function doObserve
         * @param {Object} object
         * @param {Handler} handler
         * @param {String[]} [acceptList]
         */
        doObserve = function(object, handler, acceptList) {
            var data = observed.get(object);

            if (data) {
                performPropertyChecks(data, object);
                setHandler(object, data, handler, acceptList);
            } else {
                data = createObjectData(object);
                setHandler(object, data, handler, acceptList);

                if (observed.size === 1)
                    // Let the observation begin!
                    nextFrame(runGlobalLoop);
            }
        },

        /**
         * Creates the initial data for an observed object
         * @function createObjectData
         * @param {Object} object
         */
        createObjectData = function(object, data) {
            var props = getProps(object),
                values = [], descs, i = 0,
                data = {
                    handlers: createMap(),
                    frozen: O.isFrozen ? O.isFrozen(object) : false,
                    extensible: O.isExtensible ? O.isExtensible(object) : true,
                    proto: getPrototype && getPrototype(object),
                    properties: props,
                    values: values,
                    notifier: retrieveNotifier(object, data)
                };

            if (getDescriptor) {
                descs = data.descriptors = [];
                while (i < props.length) {
                    descs[i] = getDescriptor(object, props[i]);
                    values[i] = object[props[i++]];
                }
            } else while (i < props.length)
                values[i] = object[props[i++]];

            observed.set(object, data);

            return data;
        },

        /**
         * Performs basic property value change checks on an observed object
         * @function performPropertyChecks
         * @param {ObjectData} data
         * @param {Object} object
         * @param {String} [except]  Doesn't deliver the changes to the
         *                           handlers that accept this type
         */
        performPropertyChecks = (function() {
            var updateCheck = getDescriptor ? function(object, data, idx, except, descr) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx],
                    odesc = data.descriptors[idx];

                if ("value" in descr && (ovalue === value
                        ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
                if (odesc.configurable && (!descr.configurable
                        || descr.writable !== odesc.writable
                        || descr.enumerable !== odesc.enumerable
                        || descr.get !== odesc.get
                        || descr.set !== odesc.set)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "reconfigure",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.descriptors[idx] = descr;
                }
            } : function(object, data, idx, except) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx];

                if (ovalue === value ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
            };

            // Checks if some property has been deleted
            var deletionCheck = getDescriptor ? function(object, props, proplen, data, except) {
                var i = props.length, descr;
                while (proplen && i--) {
                    if (props[i] !== null) {
                        descr = getDescriptor(object, props[i]);
                        proplen--;

                        // If there's no descriptor, the property has really
                        // been deleted; otherwise, it's been reconfigured so
                        // that's not enumerable anymore
                        if (descr) updateCheck(object, data, i, except, descr);
                        else {
                            addChangeRecord(object, data, {
                                name: props[i],
                                type: "delete",
                                object: object,
                                oldValue: data.values[i]
                            }, except);
                            data.properties.splice(i, 1);
                            data.values.splice(i, 1);
                            data.descriptors.splice(i, 1);
                        }
                    }
                }
            } : function(object, props, proplen, data, except) {
                var i = props.length;
                while (proplen && i--)
                    if (props[i] !== null) {
                        addChangeRecord(object, data, {
                            name: props[i],
                            type: "delete",
                            object: object,
                            oldValue: data.values[i]
                        }, except);
                        data.properties.splice(i, 1);
                        data.values.splice(i, 1);
                        proplen--;
                    }
            };

            return function(data, object, except) {
                if (!data.handlers.size || data.frozen) return;

                var props, proplen, keys,
                    values = data.values,
                    descs = data.descriptors,
                    i = 0, idx,
                    key, value,
                    proto, descr;

                // If the object isn't extensible, we don't need to check for new
                // or deleted properties
                if (data.extensible) {

                    props = data.properties.slice();
                    proplen = props.length;
                    keys = getProps(object);

                    if (descs) {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            descr = getDescriptor(object, key);

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(object[key]);
                                descs.push(descr);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except, descr);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);

                        if (!O.isExtensible(object)) {
                            data.extensible = false;
                            addChangeRecord(object, data, {
                                type: "preventExtensions",
                                object: object
                            }, except);

                            data.frozen = O.isFrozen(object);
                        }
                    } else {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            value = object[key];

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(value);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);
                    }

                } else if (!data.frozen) {

                    // If the object is not extensible, but not frozen, we just have
                    // to check for value changes
                    for (; i < props.length; i++) {
                        key = props[i];
                        updateCheck(object, data, i, except, getDescriptor(object, key));
                    }

                    if (O.isFrozen(object))
                        data.frozen = true;
                }

                if (getPrototype) {
                    proto = getPrototype(object);
                    if (proto !== data.proto) {
                        addChangeRecord(object, data, {
                            type: "setPrototype",
                            name: "__proto__",
                            object: object,
                            oldValue: data.proto
                        });
                        data.proto = proto;
                    }
                }
            };
        })(),

        /**
         * Sets up the main loop for object observation and change notification
         * It stops if no object is observed.
         * @function runGlobalLoop
         */
        runGlobalLoop = function() {
            if (observed.size) {
                observed.forEach(performPropertyChecks);
                handlers.forEach(deliverHandlerRecords);
                nextFrame(runGlobalLoop);
            }
        },

        /**
         * Deliver the change records relative to a certain handler, and resets
         * the record list.
         * @param {HandlerData} hdata
         * @param {Handler} handler
         */
        deliverHandlerRecords = function(hdata, handler) {
            var records = hdata.changeRecords;
            if (records.length) {
                hdata.changeRecords = [];
                handler(records);
            }
        },

        /**
         * Returns the notifier for an object - whether it's observed or not
         * @function retrieveNotifier
         * @param {Object} object
         * @param {ObjectData} [data]
         * @returns {Notifier}
         */
        retrieveNotifier = function(object, data) {
            if (arguments.length < 2)
                data = observed.get(object);

            /** @type {Notifier} */
            return data && data.notifier || {
                /**
                 * @method notify
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype._notify
                 * @memberof Notifier
                 * @param {ChangeRecord} changeRecord
                 */
                notify: function(changeRecord) {
                    changeRecord.type; // Just to check the property is there...

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object);
                    if (data) {
                        var recordCopy = { object: object }, prop;
                        for (prop in changeRecord)
                            if (prop !== "object")
                                recordCopy[prop] = changeRecord[prop];
                        addChangeRecord(object, data, recordCopy);
                    }
                },

                /**
                 * @method performChange
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype_.performchange
                 * @memberof Notifier
                 * @param {String} changeType
                 * @param {Performer} func     The task performer
                 * @param {*} [thisObj]        Used to set `this` when calling func
                 */
                performChange: function(changeType, func/*, thisObj*/) {
                    if (typeof changeType !== "string")
                        throw new TypeError("Invalid non-string changeType");

                    if (typeof func !== "function")
                        throw new TypeError("Cannot perform non-function");

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object),
                        prop, changeRecord,
                        thisObj = arguments[2],
                        result = thisObj === _undefined ? func() : func.call(thisObj);

                    data && performPropertyChecks(data, object, changeType);

                    // If there's no data, the object has been unobserved
                    if (data && result && typeof result === "object") {
                        changeRecord = { object: object, type: changeType };
                        for (prop in result)
                            if (prop !== "object" && prop !== "type")
                                changeRecord[prop] = result[prop];
                        addChangeRecord(object, data, changeRecord);
                    }
                }
            };
        },

        /**
         * Register (or redefines) an handler in the collection for a given
         * object and a given type accept list.
         * @function setHandler
         * @param {Object} object
         * @param {ObjectData} data
         * @param {Handler} handler
         * @param {String[]} acceptList
         */
        setHandler = function(object, data, handler, acceptList) {
            var hdata = handlers.get(handler);
            if (!hdata)
                handlers.set(handler, hdata = {
                    observed: createMap(),
                    changeRecords: []
                });
            hdata.observed.set(object, {
                acceptList: acceptList.slice(),
                data: data
            });
            data.handlers.set(handler, hdata);
        },

        /**
         * Adds a change record in a given ObjectData
         * @function addChangeRecord
         * @param {Object} object
         * @param {ObjectData} data
         * @param {ChangeRecord} changeRecord
         * @param {String} [except]
         */
        addChangeRecord = function(object, data, changeRecord, except) {
            data.handlers.forEach(function(hdata) {
                var acceptList = hdata.observed.get(object).acceptList;
                // If except is defined, Notifier.performChange has been
                // called, with except as the type.
                // All the handlers that accepts that type are skipped.
                if ((typeof except !== "string"
                        || inArray(acceptList, except) === -1)
                        && inArray(acceptList, changeRecord.type) > -1)
                    hdata.changeRecords.push(changeRecord);
            });
        };

    observed = createMap();
    handlers = createMap();

    /**
     * @function Object.observe
     * @see http://arv.github.io/ecmascript-object-observe/#Object.observe
     * @param {Object} object
     * @param {Handler} handler
     * @param {String[]} [acceptList]
     * @throws {TypeError}
     * @returns {Object}               The observed object
     */
    O.observe = function observe(object, handler, acceptList) {
        if (!object || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.observe cannot observe non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.observe cannot deliver to non-function");

        if (O.isFrozen && O.isFrozen(handler))
            throw new TypeError("Object.observe cannot deliver to a frozen function object");

        if (acceptList === _undefined)
            acceptList = defaultAcceptList;
        else if (!acceptList || typeof acceptList !== "object")
            throw new TypeError("Third argument to Object.observe must be an array of strings.");

        doObserve(object, handler, acceptList);

        return object;
    };

    /**
     * @function Object.unobserve
     * @see http://arv.github.io/ecmascript-object-observe/#Object.unobserve
     * @param {Object} object
     * @param {Handler} handler
     * @throws {TypeError}
     * @returns {Object}         The given object
     */
    O.unobserve = function unobserve(object, handler) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.unobserve cannot unobserve non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.unobserve cannot deliver to non-function");

        var hdata = handlers.get(handler), odata;

        if (hdata && (odata = hdata.observed.get(object))) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            nextFrame(function() {
                deliverHandlerRecords(hdata, handler);
            });

            // In Firefox 13-18, size is a function, but createMap should fall
            // back to the shim for those versions
            if (hdata.observed.size === 1 && hdata.observed.has(object))
                handlers["delete"](handler);
            else hdata.observed["delete"](object);

            if (odata.data.handlers.size === 1)
                observed["delete"](object);
            else odata.data.handlers["delete"](handler);
        }

        return object;
    };

    /**
     * @function Object.getNotifier
     * @see http://arv.github.io/ecmascript-object-observe/#GetNotifier
     * @param {Object} object
     * @throws {TypeError}
     * @returns {Notifier}
     */
    O.getNotifier = function getNotifier(object) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.getNotifier cannot getNotifier non-object");

        if (O.isFrozen && O.isFrozen(object)) return null;

        return retrieveNotifier(object);
    };

    /**
     * @function Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#DeliverChangeRecords
     * @param {Handler} handler
     * @throws {TypeError}
     */
    O.deliverChangeRecords = function deliverChangeRecords(handler) {
        if (typeof handler !== "function")
            throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");

        var hdata = handlers.get(handler);
        if (hdata) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            deliverHandlerRecords(hdata, handler);
        }
    };

})(Object, Array, this);

},{}],294:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],295:[function(require,module,exports){
'use strict';

var _support = require('./support');

require('babel-polyfill');

require('indexeddbshim');

require('mutationobserver-shim');

require('object.observe');

require('array.observe');

// reTHINK modules
// import RuntimeUA from 'runtime-core/dist/runtimeUA';

// import SandboxFactory from '../resources/sandboxes/SandboxFactory';
// let sandboxFactory = new SandboxFactory();
var avatar = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

// You can change this at your own domain


// polyfills
var domain = "rethink.quobis.com";
window.runtime = { "domain": domain };

// Hack because the GraphConnector jsrsasign module;
window.KJUR = {};

// Check if the document is ready
if (document.readyState === 'complete') {
  documentReady();
} else {
  window.addEventListener('onload', documentReady, false);
  document.addEventListener('DOMContentLoaded', documentReady, false);
}

var runtimeLoader;

function documentReady() {

  // ready();

  var hypertyHolder = $('.hyperties');
  hypertyHolder.removeClass('hide');

  window.rethink.default.install({ runtimeURL: "https://" + domain + "/runtime/Runtime", development: true }).then(runtimeInstalled).catch(_support.errorMessage);
}

function runtimeInstalled(runtime) {
  console.log(runtime);

  // put here the options to select observer or reporter
  var selection = $('.selection-panel');

  var helloReporter = '<button class="deploy-reporter">Hello World Reporter</button>';
  var helloObserver = '<button class="deploy-observer">Hello World Observer</button>';

  selection.append(helloReporter);
  selection.append(helloObserver);

  $('.deploy-reporter').on('click', function (e) {
    console.log(runtime);
    deployReporter(runtime);
  });
  $('.deploy-observer').on('click', function (e) {
    console.log(runtime);
    deployObserver(runtime);
  });
}

},{"./support":296,"array.observe":1,"babel-polyfill":2,"indexeddbshim":291,"mutationobserver-shim":292,"object.observe":293}],296:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLoader = addLoader;
exports.removeLoader = removeLoader;
exports.ready = ready;
exports.errorMessage = errorMessage;
exports.getUserMedia = getUserMedia;
exports.serialize = serialize;
// jshint browser:true, jquery: true
/* global Handlebars */

function addLoader(target) {
  var html = '<div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

  target.addClass('center-align');
  target.html(html);
}

function removeLoader(target) {
  target.children('.preloader-wrapper').remove();
  target.removeClass('center-align');
}

function ready() {
  var progress = document.querySelector('.progress');
  progress.parentElement.removeChild(progress);

  var container = document.querySelector('.container');
  container.className = container.className.replace('hide', '');

  serialize();
}

function errorMessage(reason) {
  console.error(reason);
}

/**
 * Get WebRTC API resources
 * @param  {Object}     options Object containing the information that resources will be used (camera, mic, resolution, etc);
 * @return {Promise}
 */
function getUserMedia(constraints) {

  return new Promise(function (resolve, reject) {

    navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
      resolve(mediaStream);
    }).catch(function (reason) {
      reject(reason);
    });
  });
}

function serialize() {

  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }

        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });

    return o;
  };

  $.fn.serializeObjectArray = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }

        o[this.name].push(this.value || '');
      } else {
        if (!o[this.name]) o[this.name] = [];
        o[this.name].push(this.value || '');
      }
    });

    return o;
  };
}

},{}]},{},[295]);
