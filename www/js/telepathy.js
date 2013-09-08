;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * telepathy
 * https://github.com/rummik/telepathy
 *
 * Copyright (c) 2012 rummik
 * Licensed under the MPL license.
 */

var CryptoJS   = require('crypto-js'),
    BD         = require('bigdecimal'),
    BigInteger = BD.BigInteger;

/**
 * Telepathy constructor
 * @constructor
 * @param {object|string} [options]
 */
function Telepathy(options) {
	options = options || {};

	if (typeof options == 'string')
		options = { secret: options };

	this.setSecret(options.secret);
	delete options.secret;

	this.user      = options.user || '';
	this.alphabet  = options.alphabet || Telepathy.alphabet.base62;
	this.length    = options.length || 10;
	this.domain    = options.domain || '';
	this.algorithm = options.algorithm || 'SHA3';
}

/**
 * Set the private secret we'll be using in generating passwords
 * @param {string} secret
 */
Telepathy.prototype.setSecret = function(secret) {
	this.password = this.constructor.prototype._password.bind(this, secret || '');
};

/**
 * Generate a password
 * @param {object|string|number} [options]
 * @returns {string} Generated password
 * @example
 * var telepathy = new Telepathy('secret');
 * console.log(telepathy.password('google.com'));
 */
Telepathy.prototype.password = function(options) {};

/** @ignore */
Telepathy.prototype._password = function(secret, options) {
	options = options || {};

	if (typeof options == 'string')
		options = { domain: options };

	if (typeof options == 'number')
		options = { index: options };

	var length    = parseInt(options.length || this.length || 10, 10),
	    index     = Math.max(parseInt(options.index || 0, 10), 0),
	    user      = options.user     || this.user,
	    domain    = options.domain   || this.domain,
	    alphabet  = options.alphabet || this.alphabet,
	    algorithm = options.algorithm || this.algorithm,
	    hasher    = Telepathy.algorithms[algorithm.toUpperCase()] || Telepathy.algorithms['SHA3'],
	    password  = '',
	    base      = new BigInteger(alphabet.length.toString()),
	    data      = user + domain,
	    len       = length * (index + 1),
	    result, hash, remainder;

	secret = options.secret || secret;

	while (password.length < len) {
		// create hash, and make it a big integer
		hash = new BigInteger(hasher(data + password, secret).toString(), 16);

		// convert hash to an arbitrary base
		while (hash.compareTo(base) >= 0 && password.length < len) {
			result    = hash.divideAndRemainder(base);
			hash      = result[0];
			remainder = result[1];

			password = alphabet[remainder] + password;

			if (hash.compareTo(base) == -1 && password.length < len)
				password = alphabet[hash] + password;
		}
	}

	return password.substr(0, length);
};


/**
 * Available hashing algorithms
 * @namespace
 */
Telepathy.algorithms = {
	MD5: function(data, secret) {
		return CryptoJS.MD5(secret + data);
	},

	SHA1: function(data, secret) {
		return CryptoJS.SHA1(secret + data);
	},

	SHA512: function(data, secret) {
		return CryptoJS.SHA512(secret + data);
	},
	SHA384: function(data, secret) {
		return CryptoJS.SHA384(secret + data);
	},
	SHA256: function(data, secret) {
		return CryptoJS.SHA256(secret + data);
	},
	SHA224: function(data, secret) {
		return CryptoJS.SHA224(secret + data);
	},

	SHA3: function(data, secret) {
		return Telepathy.algorithms.SHA3_512(data, secret);
	},
	SHA3_512: function(data, secret) {
		return CryptoJS.SHA3(secret + data, { outputLength: 512 });
	},
	SHA3_384: function(data, secret) {
		return CryptoJS.SHA3(secret + data, { outputLength: 384 });
	},
	SHA3_256: function(data, secret) {
		return CryptoJS.SHA3(secret + data, { outputLength: 256 });
	},
	SHA3_224: function(data, secret) {
		return CryptoJS.SHA3(secret + data, { outputLength: 224 });
	},

	RIPEMD160: function(data, secret) {
		return CryptoJS.RIPEMD160(secret + data);
	}
};

/**
 * Output alphabets used in password generation (larger alphabets are better)
 * @readonly
 * @namespace
 * @property {string} base94 WARNING: this could break insecure login forms
 * @property {string} base62
 * @property {string} base36
 * @property {string} base16
 * @property {string} base10
 * @property {string} base8
 * @property {string} base5
 * @property {string} base2
 */
Telepathy.alphabet = {
	base94: '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
	base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	base36: '0123456789abcdefghijklmnopqrstuvwxyz',
	base16: '0123456789abcdef',
	base10: '0123456789',
	base8:  '01234567',
	base5:  '01234',
	base2:  '01'
};

module.exports = Telepathy;

},{"bigdecimal":2,"crypto-js":11}],2:[function(require,module,exports){

(function(exports) {

if(typeof document === 'undefined')
  var document = {};

if(typeof window === 'undefined')
  var window = {};
if(!window.document)
  window.document = document;

if(typeof navigator === 'undefined')
  var navigator = {};
if(!navigator.userAgent)
  navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/534.51.22 (KHTML, like Gecko) Version/5.1.1 Safari/534.51.22';

function gwtapp() {};

(function(){var $gwt_version = "2.4.0";var $wnd = window;var $doc = $wnd.document;var $moduleName, $moduleBase;var $strongName = '4533928AF3A2228268FD8F10BB191446';var $stats = $wnd.__gwtStatsEvent ? function(a) {return $wnd.__gwtStatsEvent(a);} : null;var $sessionId = $wnd.__gwtStatsSessionId ? $wnd.__gwtStatsSessionId : null;$stats && $stats({moduleName:'gwtapp',sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date()).getTime(),type:'moduleEvalStart'});function H(){}
function P(){}
function O(){}
function N(){}
function M(){}
function rr(){}
function gb(){}
function ub(){}
function pb(){}
function Fb(){}
function Ab(){}
function Lb(){}
function Tb(){}
function Kb(){}
function Zb(){}
function _b(){}
function fc(){}
function ic(){}
function hc(){}
function Se(){}
function Re(){}
function Ze(){}
function Ye(){}
function Xe(){}
function Ah(){}
function Hh(){}
function Gh(){}
function Ej(){}
function Mj(){}
function Uj(){}
function _j(){}
function gk(){}
function mk(){}
function pk(){}
function wk(){}
function vk(){}
function Dk(){}
function Ik(){}
function Qk(){}
function Uk(){}
function il(){}
function ol(){}
function rl(){}
function Tl(){}
function Xl(){}
function km(){}
function om(){}
function Nn(){}
function Np(){}
function ep(){}
function dp(){}
function yp(){}
function yo(){}
function Zo(){}
function xp(){}
function Hp(){}
function Mp(){}
function Xp(){}
function bq(){}
function jq(){}
function qq(){}
function Dq(){}
function Hq(){}
function Nq(){}
function Qq(){}
function Zq(){}
function Yq(){}
function Yj(){Wj()}
function Ij(){Gj()}
function Eh(){Ch()}
function Ek(){Cb()}
function qk(){Cb()}
function Rk(){Cb()}
function Vk(){Cb()}
function jl(){Cb()}
function Oq(){Cb()}
function kk(){ik()}
function fm(){Yl(this)}
function gm(){Yl(this)}
function mg(a){Hf(this,a)}
function mq(a){this.c=a}
function bk(a){this.b=a}
function Cp(a){this.b=a}
function Sp(a){this.b=a}
function V(a){Cb();this.f=a}
function nk(a){V.call(this,a)}
function rk(a){V.call(this,a)}
function Sk(a){V.call(this,a)}
function Wk(a){V.call(this,a)}
function kl(a){V.call(this,a)}
function Yl(a){a.b=new fc}
function Ul(){this.b=new fc}
function rb(){rb=rr;qb=new ub}
function lr(){lr=rr;kr=new gr}
function jr(a,b){return b}
function ac(a,b){a.b+=b}
function bc(a,b){a.b+=b}
function cc(a,b){a.b+=b}
function dc(a,b){a.b+=b}
function or(a,b){lr();a[Ls]=b}
function nr(a,b){lr();ar(a,b)}
function _q(a,b,c){rp(a.b,b,c)}
function Jg(){rf();Hf(this,Tr)}
function pl(a){Sk.call(this,a)}
function Hk(a){return isNaN(a)}
function Jj(a){return new Oi(a)}
function Zj(a){return new Oj(a)}
function dl(a){return a<0?-a:a}
function hl(a,b){return a<b?a:b}
function gl(a,b){return a>b?a:b}
function xe(a,b){return !we(a,b)}
function ye(a,b){return !ve(a,b)}
function ir(a,b){return new b(a)}
function Oj(a){this.b=new Yn(a)}
function Nj(){this.b=(Un(),Rn)}
function ak(){this.b=(Qo(),Fo)}
function Wo(){Qo();return zo}
function mr(a,b){lr();_q(kr,a,b)}
function br(a,b){a[b]||(a[b]={})}
function kq(a){return a.b<a.c.c}
function Vn(a){return a.b<<3|a.c.c}
function Mi(a){return a.f*a.b[0]}
function Je(a){return a.l|a.m<<22}
function op(b,a){return b.f[Qr+a]}
function Yp(a,b){this.c=a;this.b=b}
function Ro(a,b){this.b=a;this.c=b}
function Iq(a,b){this.b=a;this.c=b}
function bm(a,b){ac(a.b,b);return a}
function cm(a,b){bc(a.b,b);return a}
function dm(a,b){cc(a.b,b);return a}
function pr(a){lr();return er(kr,a)}
function qr(a){lr();return fr(kr,a)}
function Oi(a){Oh();oi.call(this,a)}
function Ni(){Oh();oi.call(this,Tr)}
function cg(a){dg.call(this,a,0)}
function Kg(a){mg.call(this,a.tS())}
function el(a){return Math.floor(a)}
function yl(b,a){return b.indexOf(a)}
function qp(b,a){return Qr+a in b.f}
function uc(a,b){return a.cM&&a.cM[b]}
function re(a,b){return ee(a,b,false)}
function bn(a,b){return cn(a.b,a.e,b)}
function ce(a){return de(a.l,a.m,a.h)}
function Ac(a){return a==null?null:a}
function sf(a){return a.r()<0?Mf(a):a}
function ob(a){return a.$H||(a.$H=++jb)}
function zc(a){return a.tM==rr||tc(a,1)}
function tc(a,b){return a.cM&&!!a.cM[b]}
function vl(b,a){return b.charCodeAt(a)}
function hm(a){Yl(this);cc(this.b,a)}
function oi(a){Oh();pi.call(this,a,10)}
function Aq(a,b,c,d){a.splice(b,c,d)}
function dq(a,b){(a<0||a>=b)&&hq(a,b)}
function xc(a,b){return a!=null&&tc(a,b)}
function db(a){return yc(a)?Db(wc(a)):Lr}
function Z(a){return yc(a)?$(wc(a)):a+Lr}
function Fl(a){return lc(Vd,{6:1},1,a,0)}
function vq(){this.b=lc(Td,{6:1},0,0,0)}
function Pl(){Pl=rr;Ml={};Ol={}}
function Yo(){Yo=rr;Xo=Jk((Qo(),zo))}
function ik(){if(!hk){hk=true;jk()}}
function Gj(){if(!Fj){Fj=true;Hj()}}
function Wj(){if(!Vj){Vj=true;new kk;Xj()}}
function gr(){this.b=new Fq;new Fq;new Fq}
function X(a){Cb();this.c=a;Bb(new Tb,this)}
function Pi(a){Oh();oi.call(this,Hm(a,0))}
function gg(a){hg.call(this,a,0,a.length)}
function fg(a,b){cg.call(this,a);If(this,b)}
function ze(a,b){ee(a,b,true);return ae}
function tq(a,b){dq(b,a.c);return a.b[b]}
function rq(a,b){nc(a.b,a.c++,b);return true}
function _l(a,b,c){dc(a.b,Ll(b,0,c));return a}
function kb(a,b,c){return a.apply(b,c);var d}
function em(a,b,c){return ec(a.b,b,b,c),a}
function Af(a,b,c){return yf(a,b,Bc(a.f),c)}
function xf(a,b,c){return yf(a,b,Bc(a.f),Uo(c))}
function Bl(c,a,b){return c.substr(a,b-a)}
function Al(b,a){return b.substr(a,b.length-a)}
function fl(a){return Math.log(a)*Math.LOG10E}
function cb(a){return a==null?null:a.name}
function $(a){return a==null?null:a.message}
function yc(a){return a!=null&&a.tM!=rr&&!tc(a,1)}
function ec(a,b,c,d){a.b=Bl(a.b,0,b)+d+Al(a.b,c)}
function eg(a,b,c){dg.call(this,a,b);If(this,c)}
function pg(a,b){this.g=a;this.f=b;this.b=sg(a)}
function si(a,b,c){Oh();this.f=a;this.e=b;this.b=c}
function sl(a){this.b='Unknown';this.d=a;this.c=-1}
function yk(a,b){var c;c=new wk;c.d=a+b;return c}
function dr(a,b){var c;c=mp(a.b,b);return wc(c)}
function fb(a){var b;return b=a,zc(b)?b.hC():ob(b)}
function To(a){Qo();return Ok((Yo(),Xo),a)}
function qe(a,b){return de(a.l&b.l,a.m&b.m,a.h&b.h)}
function De(a,b){return de(a.l|b.l,a.m|b.m,a.h|b.h)}
function Le(a,b){return de(a.l^b.l,a.m^b.m,a.h^b.h)}
function Bm(a,b){return (a.b[~~b>>5]&1<<(b&31))!=0}
function Cq(a,b){var c;for(c=0;c<b;++c){a[c]=false}}
function Lf(a,b,c){var d;d=Kf(a,b);If(d,c);return d}
function zb(a,b){a.length>=b&&a.splice(0,b);return a}
function wb(a,b){!a&&(a=[]);a[a.length]=b;return a}
function Ph(a,b){if(mi(a,b)){return tm(a,b)}return a}
function ii(a,b){if(!mi(a,b)){return tm(a,b)}return a}
function _d(a){if(xc(a,15)){return a}return new X(a)}
function Eb(){try{null.a()}catch(a){return a}}
function Ak(a){var b;b=new wk;b.d=Lr+a;b.c=1;return b}
function eb(a,b){var c;return c=a,zc(c)?c.eQ(b):c===b}
function se(a,b){return a.l==b.l&&a.m==b.m&&a.h==b.h}
function Ce(a,b){return a.l!=b.l||a.m!=b.m||a.h!=b.h}
function de(a,b,c){return _=new Se,_.l=a,_.m=b,_.h=c,_}
function rp(a,b,c){return !b?tp(a,c):sp(a,b,c,~~ob(b))}
function Eq(a,b){return Ac(a)===Ac(b)||a!=null&&eb(a,b)}
function Xq(a,b){return Ac(a)===Ac(b)||a!=null&&eb(a,b)}
function hq(a,b){throw new Wk('Index: '+a+', Size: '+b)}
function Xh(a,b){if(b<0){throw new nk(ts)}return tm(a,b)}
function dg(a,b){if(!a){throw new jl}this.f=b;Tf(this,a)}
function og(a,b){if(!a){throw new jl}this.f=b;Tf(this,a)}
function ig(a,b,c,d){hg.call(this,a,b,c);If(this,d)}
function jg(a,b){hg.call(this,a,0,a.length);If(this,b)}
function ng(a,b){hg.call(this,Cl(a),0,a.length);If(this,b)}
function lm(a){V.call(this,'String index out of range: '+a)}
function Zl(a,b){dc(a.b,String.fromCharCode(b));return a}
function pn(a,b){tn(a.b,a.b,a.e,b.b,b.e);Sh(a);a.c=-2}
function Tf(a,b){a.d=b;a.b=b.ab();a.b<54&&(a.g=Ie(ai(b)))}
function qc(){qc=rr;oc=[];pc=[];rc(new ic,oc,pc)}
function Ch(){if(!Bh){Bh=true;new Yj;new Ij;Dh()}}
function Sl(){if(Nl==256){Ml=Ol;Ol={};Nl=0}++Nl}
function cr(a){var b;b=a[Ls];if(!b){b=[];a[Ls]=b}return b}
function zk(a,b,c){var d;d=new wk;d.d=a+b;d.c=c?8:0;return d}
function xk(a,b,c){var d;d=new wk;d.d=a+b;d.c=4;d.b=c;return d}
function lc(a,b,c,d,e){var f;f=jc(e,d);mc(a,b,c,f);return f}
function Ll(a,b,c){var d;d=b+c;El(a.length,b,d);return Gl(a,b,d)}
function mo(a,b){go();return b<fo.length?lo(a,fo[b]):ei(a,po(b))}
function me(a){return a.l+a.m*4194304+a.h*17592186044416}
function vc(a,b){if(a!=null&&!uc(a,b)){throw new Ek}return a}
function lq(a){if(a.b>=a.c.c){throw new Oq}return tq(a.c,a.b++)}
function wl(a,b){if(!xc(b,1)){return false}return String(a)==b}
function lb(){if(ib++==0){sb((rb(),qb));return true}return false}
function fi(a){if(a.f<0){throw new nk('start < 0: '+a)}return xo(a)}
function pm(){V.call(this,'Add not supported on this collection')}
function Fq(){this.b=[];this.f={};this.d=false;this.c=null;this.e=0}
function qi(a,b){Oh();this.f=a;this.e=1;this.b=mc(Od,{6:1},-1,[b])}
function sc(a,b,c){qc();for(var d=0,e=b.length;d<e;++d){a[b[d]]=c[d]}}
function xl(a,b,c,d){var e;for(e=0;e<b;++e){c[d++]=a.charCodeAt(e)}}
function Wh(a,b){var c;for(c=a.e-1;c>=0&&a.b[c]==b[c];--c){}return c<0}
function tp(a,b){var c;c=a.c;a.c=b;if(!a.d){a.d=true;++a.e}return c}
function $l(a,b){dc(a.b,String.fromCharCode.apply(null,b));return a}
function am(a,b,c,d){b==null&&(b=Mr);bc(a.b,b.substr(c,d-c));return a}
function sn(a,b,c,d){var e;e=lc(Od,{6:1},-1,b,1);tn(e,a,b,c,d);return e}
function mc(a,b,c,d){qc();sc(d,oc,pc);d.aC=a;d.cM=b;d.qI=c;return d}
function uq(a,b,c){for(;c<a.c;++c){if(Xq(b,a.b[c])){return c}}return -1}
function sq(a,b,c){(b<0||b>a.c)&&hq(b,a.c);Aq(a.b,b,0,c);++a.c}
function nn(a,b){var c;c=on(a.b,a.e,b);if(c==1){a.b[a.e]=1;++a.e}a.c=-2}
function Sh(a){while(a.e>0&&a.b[--a.e]==0){}a.b[a.e++]==0&&(a.f=0)}
function Gg(a){if(we(a,ur)&&xe(a,xr)){return df[Je(a)]}return new qg(a,0)}
function ji(a,b){if(b==0||a.f==0){return a}return b>0?wm(a,b):zm(a,-b)}
function li(a,b){if(b==0||a.f==0){return a}return b>0?zm(a,b):wm(a,-b)}
function $h(a){var b;if(a.f==0){return -1}b=Zh(a);return (b<<5)+_k(a.b[b])}
function bl(a){var b;b=Je(a);return b!=0?_k(b):_k(Je(Fe(a,32)))+32}
function Sb(a,b){var c;c=Mb(a,b);return c.length==0?(new Fb).o(b):zb(c,1)}
function Gl(a,b,c){a=a.slice(b,c);return String.fromCharCode.apply(null,a)}
function rc(a,b,c){var d=0,e;for(var f in a){if(e=a[f]){b[d]=f;c[d]=e;++d}}}
function up(e,a,b){var c,d=e.f;a=Qr+a;a in d?(c=d[a]):++e.e;d[a]=b;return c}
function gn(a,b,c,d){var e;e=lc(Od,{6:1},-1,b+1,1);hn(e,a,b,c,d);return e}
function Cl(a){var b,c;c=a.length;b=lc(Md,{6:1},-1,c,1);xl(a,c,b,0);return b}
function _e(a){var b;b=bf(a);if(isNaN(b)){throw new pl(Zr+a+$r)}return b}
function Fg(a){if(!isFinite(a)||isNaN(a)){throw new pl(hs)}return new mg(Lr+a)}
function wc(a){if(a!=null&&(a.tM==rr||tc(a,1))){throw new Ek}return a}
function Qf(a,b){var c;c=new og((!a.d&&(a.d=Li(a.g)),a.d),a.f);If(c,b);return c}
function bg(a,b){var c;c=new Pi(Zf(a));if(sm(c)<b){return ai(c)}throw new nk(cs)}
function ei(a,b){if(b.f==0){return Nh}if(a.f==0){return Nh}return go(),ho(a,b)}
function bi(a,b){var c;if(b.f<=0){throw new nk(us)}c=hi(a,b);return c.f<0?fn(c,b):c}
function Ip(a){var b;b=new vq;a.d&&rq(b,new Sp(a));kp(a,b);jp(a,b);this.b=new mq(b)}
function lp(a,b){return b==null?a.d:xc(b,1)?qp(a,vc(b,1)):pp(a,b,~~fb(b))}
function mp(a,b){return b==null?a.c:xc(b,1)?op(a,vc(b,1)):np(a,b,~~fb(b))}
function Bc(a){return ~~Math.max(Math.min(a,2147483647),-2147483648)}
function qg(a,b){this.f=b;this.b=tg(a);this.b<54?(this.g=Ie(a)):(this.d=Ki(a))}
function kg(a){if(!isFinite(a)||isNaN(a)){throw new pl(hs)}Hf(this,a.toPrecision(20))}
function mb(b){return function(){try{return nb(b,this,arguments)}catch(a){throw a}}}
function nb(a,b,c){var d;d=lb();try{return kb(a,b,c)}finally{d&&tb((rb(),qb));--ib}}
function Ok(a,b){var c;c=a[Qr+b];if(c){return c}if(b==null){throw new jl}throw new Rk}
function sb(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=xb(b,c)}while(a.b);a.b=c}}
function tb(a){var b,c;if(a.c){c=null;do{b=a.c;a.c=null;c=xb(b,c)}while(a.c);a.c=c}}
function _k(a){var b,c;if(a==0){return 32}else{c=0;for(b=1;(b&a)==0;b<<=1){++c}return c}}
function Jk(a){var b,c,d,e;b={};for(d=0,e=a.length;d<e;++d){c=a[d];b[Qr+c.b]=c}return b}
function Rb(a){var b;b=zb(Sb(a,Eb()),3);b.length==0&&(b=zb((new Fb).k(),1));return b}
function Wn(a){var b;b=new gm;$l(b,Sn);bm(b,a.b);b.b.b+=ys;$l(b,Tn);cm(b,a.c);return b.b.b}
function Rh(a){var b;b=lc(Od,{6:1},-1,a.e,1);nm(a.b,0,b,0,a.e);return new si(a.f,a.e,b)}
function Bf(a,b){var c;c=lc(Wd,{6:1},16,2,0);nc(c,0,Df(a,b));nc(c,1,Xf(a,Kf(c[0],b)));return c}
function Cf(a,b,c){var d;d=lc(Wd,{6:1},16,2,0);nc(d,0,Ef(a,b,c));nc(d,1,Xf(a,Kf(d[0],b)));return d}
function $o(a,b){var c;while(a.Pb()){c=a.Qb();if(b==null?c==null:eb(b,c)){return a}}return null}
function Zh(a){var b;if(a.c==-2){if(a.f==0){b=-1}else{for(b=0;a.b[b]==0;++b){}}a.c=b}return a.c}
function bb(a){var b;return a==null?Mr:yc(a)?cb(wc(a)):xc(a,1)?Nr:(b=a,zc(b)?b.gC():Gc).d}
function Uf(a){if(a.b<54){return a.g<0?-1:a.g>0?1:0}return (!a.d&&(a.d=Li(a.g)),a.d).r()}
function Mf(a){if(a.b<54){return new pg(-a.g,a.f)}return new og((!a.d&&(a.d=Li(a.g)),a.d).cb(),a.f)}
function El(a,b,c){if(b<0){throw new lm(b)}if(c<b){throw new lm(c-b)}if(c>a){throw new lm(c)}}
function lg(a,b){if(!isFinite(a)||isNaN(a)){throw new pl(hs)}Hf(this,a.toPrecision(20));If(this,b)}
function Gk(a,b){if(isNaN(a)){return isNaN(b)?0:1}else if(isNaN(b)){return -1}return a<b?-1:a>b?1:0}
function uk(a,b){if(b<2||b>36){return 0}if(a<0||a>=b){return 0}return a<10?48+a&65535:97+a-10&65535}
function er(a,b){var c;if(!b){return null}c=b[Ls];if(c){return c}c=ir(b,dr(a,b.gC()));b[Ls]=c;return c}
function ke(a){var b,c;c=$k(a.h);if(c==32){b=$k(a.m);return b==32?$k(a.l)+32:b+20-10}else{return c-12}}
function be(a){var b,c,d;b=a&4194303;c=~~a>>22&4194303;d=a<0?1048575:0;return de(b,c,d)}
function Qe(){Qe=rr;Me=de(4194303,4194303,524287);Ne=de(0,0,524288);Oe=ue(1);ue(2);Pe=ue(0)}
function mn(a,b){hn(a.b,a.b,a.e,b.b,b.e);a.e=hl(gl(a.e,b.e)+1,a.b.length);Sh(a);a.c=-2}
function um(a,b){var c;c=~~b>>5;a.e+=c+($k(a.b[a.e-1])-(b&31)>=0?0:1);xm(a.b,a.b,c,b&31);Sh(a);a.c=-2}
function Tm(a,b){var c,d;c=~~b>>5;if(a.e<c||a.ab()<=b){return}d=32-(b&31);a.e=c+1;a.b[c]&=d<32?~~-1>>>d:0;Sh(a)}
function ai(a){var b;b=a.e>1?De(Ee(ue(a.b[1]),32),qe(ue(a.b[0]),yr)):qe(ue(a.b[0]),yr);return Ae(ue(a.f),b)}
function jn(a,b,c){var d;for(d=c-1;d>=0&&a[d]==b[d];--d){}return d<0?0:xe(qe(ue(a[d]),yr),qe(ue(b[d]),yr))?-1:1}
function ym(a,b,c){var d,e,f;d=0;for(e=0;e<c;++e){f=b[e];a[e]=f<<1|d;d=~~f>>>31}d!=0&&(a[c]=d)}
function ge(a,b,c,d,e){var f;f=Fe(a,b);c&&je(f);if(e){a=ie(a,b);d?(ae=Be(a)):(ae=de(a.l,a.m,a.h))}return f}
function gwtOnLoad(b,c,d,e){$moduleName=c;$moduleBase=d;if(b)try{Jr($d)()}catch(a){b(c)}else{Jr($d)()}}
function fr(a,b){var c,d,e;if(b==null){return null}d=cr(b);e=d;for(c=0;c<b.length;++c){e[c]=er(a,b[c])}return d}
function Mb(a,b){var c,d,e;e=b&&b.stack?b.stack.split('\n'):[];for(c=0,d=e.length;c<d;++c){e[c]=a.n(e[c])}return e}
function Um(a,b){var c,d;d=~~b>>5==a.e-1&&a.b[a.e-1]==1<<(b&31);if(d){for(c=0;d&&c<a.e-1;++c){d=a.b[c]==0}}return d}
function _h(a){var b;if(a.d!=0){return a.d}for(b=0;b<a.b.length;++b){a.d=a.d*33+(a.b[b]&-1)}a.d=a.d*a.f;return a.d}
function Hg(a,b){if(b==0){return Gg(a)}if(se(a,ur)&&b>=0&&b<pf.length){return pf[b]}return new qg(a,b)}
function Ig(a){if(a==Bc(a)){return Hg(ur,Bc(a))}if(a>=0){return new qg(ur,2147483647)}return new qg(ur,-2147483648)}
function Li(a){Oh();if(a<0){if(a!=-1){return new ui(-1,-a)}return Ih}else return a<=10?Kh[Bc(a)]:new ui(1,a)}
function zg(a){var b=qf;!b&&(b=qf=/^[+-]?\d*$/i);if(b.test(a)){return parseInt(a,10)}else{return Number.NaN}}
function kp(e,a){var b=e.f;for(var c in b){if(c.charCodeAt(0)==58){var d=new Yp(e,c.substring(1));a.Kb(d)}}}
function Rl(a){Pl();var b=Qr+a;var c=Ol[b];if(c!=null){return c}c=Ml[b];c==null&&(c=Ql(a));Sl();return Ol[b]=c}
function Be(a){var b,c,d;b=~a.l+1&4194303;c=~a.m+(b==0?1:0)&4194303;d=~a.h+(b==0&&c==0?1:0)&1048575;return de(b,c,d)}
function je(a){var b,c,d;b=~a.l+1&4194303;c=~a.m+(b==0?1:0)&4194303;d=~a.h+(b==0&&c==0?1:0)&1048575;a.l=b;a.m=c;a.h=d}
function Q(a){var b,c,d;c=lc(Ud,{6:1},13,a.length,0);for(d=0,b=a.length;d<b;++d){if(!a[d]){throw new jl}c[d]=a[d]}}
function Cb(){var a,b,c,d;c=Rb(new Tb);d=lc(Ud,{6:1},13,c.length,0);for(a=0,b=d.length;a<b;++a){d[a]=new sl(c[a])}Q(d)}
function fk(){var a,b,c;c=(Qo(),Qo(),zo);b=lc(Sd,{6:1},5,c.length,0);for(a=0;a<c.length;++a)b[a]=new bk(c[a]);return b}
function ki(a){var b,c,d,e;return a.f==0?a:(e=a.e,c=e+1,b=lc(Od,{6:1},-1,c,1),ym(b,a.b,e),d=new si(a.f,c,b),Sh(d),d)}
function Ym(a,b,c,d){var e,f;e=c.e;f=lc(Od,{6:1},-1,(e<<1)+1,1);io(a.b,hl(e,a.e),b.b,hl(e,b.e),f);Zm(f,c,d);return Pm(f,c)}
function Vh(a,b){var c;if(a===b){return true}if(xc(b,17)){c=vc(b,17);return a.f==c.f&&a.e==c.e&&Wh(a,c.b)}return false}
function Zk(a){var b;if(a<0){return -2147483648}else if(a==0){return 0}else{for(b=1073741824;(b&a)==0;b>>=1){}return b}}
function sm(a){var b,c,d;if(a.f==0){return 0}b=a.e<<5;c=a.b[a.e-1];if(a.f<0){d=Zh(a);d==a.e-1&&(c=~~(c-1))}b-=$k(c);return b}
function io(a,b,c,d,e){go();if(b==0||d==0){return}b==1?(e[d]=ko(e,c,d,a[0])):d==1?(e[b]=ko(e,a,b,c[0])):jo(a,c,e,b,d)}
function en(a,b,c,d,e){var f,g;g=a;for(f=c.ab()-1;f>=0;--f){g=Ym(g,g,d,e);(c.b[~~f>>5]&1<<(f&31))!=0&&(g=Ym(g,b,d,e))}return g}
function on(a,b,c){var d,e;d=qe(ue(c),yr);for(e=0;Ce(d,ur)&&e<b;++e){d=pe(d,qe(ue(a[e]),yr));a[e]=Je(d);d=Fe(d,32)}return Je(d)}
function hg(b,c,d){var a,e;try{Hf(this,Ll(b,c,d))}catch(a){a=_d(a);if(xc(a,14)){e=a;throw new pl(e.f)}else throw a}}
function Dg(a){if(a<-2147483648){throw new nk('Overflow')}else if(a>2147483647){throw new nk('Underflow')}else{return Bc(a)}}
function Xn(a,b){Un();if(a<0){throw new Sk('Digits < 0')}if(!b){throw new kl('null RoundingMode')}this.b=a;this.c=b}
function Ki(a){Oh();if(xe(a,ur)){if(Ce(a,wr)){return new ti(-1,Be(a))}return Ih}else return ye(a,tr)?Kh[Je(a)]:new ti(1,a)}
function tg(a){var b;xe(a,ur)&&(a=de(~a.l&4194303,~a.m&4194303,~a.h&1048575));return 64-(b=Je(Fe(a,32)),b!=0?$k(b):$k(Je(a))+32)}
function pe(a,b){var c,d,e;c=a.l+b.l;d=a.m+b.m+(~~c>>22);e=a.h+b.h+(~~d>>22);return de(c&4194303,d&4194303,e&1048575)}
function He(a,b){var c,d,e;c=a.l-b.l;d=a.m-b.m+(~~c>>22);e=a.h-b.h+(~~d>>22);return de(c&4194303,d&4194303,e&1048575)}
function Sm(a,b){var c;c=b-1;if(a.f>0){while(!a.gb(c)){--c}return b-1-c}else{while(a.gb(c)){--c}return b-1-gl(c,a.bb())}}
function fe(a,b){if(a.h==524288&&a.m==0&&a.l==0){b&&(ae=de(0,0,0));return ce((Qe(),Oe))}b&&(ae=de(a.l,a.m,a.h));return de(0,0,0)}
function Ff(a,b){var c;if(a===b){return true}if(xc(b,16)){c=vc(b,16);return c.f==a.f&&(a.b<54?c.g==a.g:a.d.eQ(c.d))}return false}
function cn(a,b,c){var d,e,f,g;f=ur;for(d=b-1;d>=0;--d){g=pe(Ee(f,32),qe(ue(a[d]),yr));e=Nm(g,c);f=ue(Je(Fe(e,32)))}return Je(f)}
function wm(a,b){var c,d,e,f;c=~~b>>5;b&=31;e=a.e+c+(b==0?0:1);d=lc(Od,{6:1},-1,e,1);xm(d,a.b,c,b);f=new si(a.f,e,d);Sh(f);return f}
function ue(a){var b,c;if(a>-129&&a<128){b=a+128;oe==null&&(oe=lc(Pd,{6:1},2,256,0));c=oe[b];!c&&(c=oe[b]=be(a));return c}return be(a)}
function Ai(a){Oh();var b,c,d;if(a<Mh.length){return Mh[a]}c=~~a>>5;b=a&31;d=lc(Od,{6:1},-1,c+1,1);d[c]=1<<b;return new si(1,c+1,d)}
function ri(a){Oh();if(a.length==0){this.f=0;this.e=1;this.b=mc(Od,{6:1},-1,[0])}else{this.f=1;this.e=a.length;this.b=a;Sh(this)}}
function Dl(c){if(c.length==0||c[0]>ys&&c[c.length-1]>ys){return c}var a=c.replace(/^(\s*)/,Lr);var b=a.replace(/\s*$/,Lr);return b}
function Yk(a){a-=~~a>>1&1431655765;a=(~~a>>2&858993459)+(a&858993459);a=(~~a>>4)+a&252645135;a+=~~a>>8;a+=~~a>>16;return a&63}
function nc(a,b,c){if(c!=null){if(a.qI>0&&!uc(c,a.qI)){throw new qk}if(a.qI<0&&(c.tM==rr||tc(c,1))){throw new qk}}return a[b]=c}
function Qh(a,b){if(a.f>b.f){return 1}if(a.f<b.f){return -1}if(a.e>b.e){return a.f}if(a.e<b.e){return -b.f}return a.f*jn(a.b,b.b,a.e)}
function Rf(a,b){var c;c=a.f-b;if(a.b<54){if(a.g==0){return Ig(c)}return new pg(a.g,Dg(c))}return new dg((!a.d&&(a.d=Li(a.g)),a.d),Dg(c))}
function jp(i,a){var b=i.b;for(var c in b){var d=parseInt(c,10);if(c==d){var e=b[d];for(var f=0,g=e.length;f<g;++f){a.Kb(e[f])}}}}
function np(i,a,b){var c=i.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.Rb();if(i.Ob(a,g)){return f.Sb()}}}return null}
function pp(i,a,b){var c=i.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.Rb();if(i.Ob(a,g)){return true}}}return false}
function Bq(a,b){var c,d,e,f;d=0;c=a.length-1;while(d<=c){e=d+(~~(c-d)>>1);f=a[e];if(f<b){d=e+1}else if(f>b){c=e-1}else{return e}}return -d-1}
function Pk(a){var b;b=_e(a);if(b>3.4028234663852886E38){return Infinity}else if(b<-3.4028234663852886E38){return -Infinity}return b}
function Ie(a){if(se(a,(Qe(),Ne))){return -9223372036854775808}if(!we(a,Pe)){return -me(Be(a))}return a.l+a.m*4194304+a.h*17592186044416}
function Bb(a,b){var c,d,e,f;e=Sb(a,yc(b.c)?wc(b.c):null);f=lc(Ud,{6:1},13,e.length,0);for(c=0,d=f.length;c<d;++c){f[c]=new sl(e[c])}Q(f)}
function yb(a){var b,c,d;d=Lr;a=Dl(a);b=a.indexOf(Or);if(b!=-1){c=a.indexOf('function')==0?8:0;d=Dl(a.substr(c,b-c))}return d.length>0?d:Pr}
function ie(a,b){var c,d,e;if(b<=22){c=a.l&(1<<b)-1;d=e=0}else if(b<=44){c=a.l;d=a.m&(1<<b-22)-1;e=0}else{c=a.l;d=a.m;e=a.h&(1<<b-44)-1}return de(c,d,e)}
function Db(b){var c=Lr;try{for(var d in b){if(d!='name'&&d!='message'&&d!='toString'){try{c+='\n '+d+Kr+b[d]}catch(a){}}}}catch(a){}return c}
function ti(a,b){this.f=a;if(se(qe(b,zr),ur)){this.e=1;this.b=mc(Od,{6:1},-1,[Je(b)])}else{this.e=2;this.b=mc(Od,{6:1},-1,[Je(b),Je(Fe(b,32))])}}
function ui(a,b){this.f=a;if(b<4294967296){this.e=1;this.b=mc(Od,{6:1},-1,[~~b])}else{this.e=2;this.b=mc(Od,{6:1},-1,[~~(b%4294967296),~~(b/4294967296)])}}
function Xm(a,b){var c,d;d=new ri(lc(Od,{6:1},-1,1<<b,1));d.e=1;d.b[0]=1;d.f=1;for(c=1;c<b;++c){Bm(ei(a,d),c)&&(d.b[~~c>>5]|=1<<(c&31))}return d}
function Jm(a){var b,c,d;b=qe(ue(a.b[0]),yr);c=sr;d=vr;do{Ce(qe(Ae(b,c),d),ur)&&(c=De(c,d));d=Ee(d,1)}while(xe(d,Fr));c=Be(c);return Je(qe(c,yr))}
function Gm(a){var b,c,d;if(we(a,ur)){c=re(a,Ar);d=ze(a,Ar)}else{b=Ge(a,1);c=re(b,Br);d=ze(b,Br);d=pe(Ee(d,1),qe(a,sr))}return De(Ee(d,32),qe(c,yr))}
function ko(a,b,c,d){go();var e,f;e=ur;for(f=0;f<c;++f){e=pe(Ae(qe(ue(b[f]),yr),qe(ue(d),yr)),qe(ue(Je(e)),yr));a[f]=Je(e);e=Ge(e,32)}return Je(e)}
function _m(a,b,c){var d,e,f,g,i;e=c.e<<5;d=bi(a.eb(e),c);i=bi(Ai(e),c);f=Jm(c);c.e==1?(g=en(i,d,b,c,f)):(g=dn(i,d,b,c,f));return Ym(g,(Oh(),Jh),c,f)}
function Om(a,b,c){var d,e,f,g,i,j;d=c.bb();e=c.fb(d);g=_m(a,b,e);i=an(a,b,d);f=Xm(e,d);j=ei(rn(i,g),f);Tm(j,d);j.f<0&&(j=fn(j,Ai(d)));return fn(g,ei(e,j))}
function xb(b,c){var a,d,e,f;for(d=0,e=b.length;d<e;++d){f=b[d];try{f[1]?f[0].Ub()&&(c=wb(c,f)):f[0].Ub()}catch(a){a=_d(a);if(!xc(a,12))throw a}}return c}
function bf(a){var b=$e;!b&&(b=$e=/^\s*[+-]?((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?[dDfF]?\s*$/i);if(b.test(a)){return parseFloat(a)}else{return Number.NaN}}
function pi(a,b){if(a==null){throw new jl}if(b<2||b>36){throw new pl('Radix out of range')}if(a.length==0){throw new pl('Zero length BigInteger')}Ei(this,a,b)}
function Vq(){Uq();var a,b,c;c=Tq+++(new Date).getTime();a=Bc(Math.floor(c*5.9604644775390625E-8))&16777215;b=Bc(c-a*16777216);this.b=a^1502;this.c=b^15525485}
function un(a,b,c,d){var e;if(c>d){return 1}else if(c<d){return -1}else{for(e=c-1;e>=0&&a[e]==b[e];--e){}return e<0?0:xe(qe(ue(a[e]),yr),qe(ue(b[e]),yr))?-1:1}}
function In(a,b){var c,d,e,f;e=a.e;d=lc(Od,{6:1},-1,e,1);hl(Zh(a),Zh(b));for(c=0;c<b.e;++c){d[c]=a.b[c]|b.b[c]}for(;c<e;++c){d[c]=a.b[c]}f=new si(1,e,d);return f}
function Mn(a,b){var c,d,e,f;e=a.e;d=lc(Od,{6:1},-1,e,1);c=hl(Zh(a),Zh(b));for(;c<b.e;++c){d[c]=a.b[c]^b.b[c]}for(;c<a.e;++c){d[c]=a.b[c]}f=new si(1,e,d);Sh(f);return f}
function Bn(a,b){var c,d,e,f;e=lc(Od,{6:1},-1,a.e,1);d=hl(a.e,b.e);for(c=Zh(a);c<d;++c){e[c]=a.b[c]&~b.b[c]}for(;c<a.e;++c){e[c]=a.b[c]}f=new si(1,a.e,e);Sh(f);return f}
function Dn(a,b){var c,d,e,f;e=hl(a.e,b.e);c=gl(Zh(a),Zh(b));if(c>=e){return Oh(),Nh}d=lc(Od,{6:1},-1,e,1);for(;c<e;++c){d[c]=a.b[c]&b.b[c]}f=new si(1,e,d);Sh(f);return f}
function Nf(a,b){var c;if(b==0){return lf}if(b<0||b>999999999){throw new nk(bs)}c=a.f*b;return a.b==0&&a.g!=-1?Ig(c):new dg((!a.d&&(a.d=Li(a.g)),a.d).db(b),Dg(c))}
function tk(a,b){if(b<2||b>36){return -1}if(a>=48&&a<48+(b<10?b:10)){return a-48}if(a>=97&&a<b+97-10){return a-97+10}if(a>=65&&a<b+65-10){return a-65+10}return -1}
function Uq(){Uq=rr;var a,b,c;Rq=lc(Nd,{6:1},-1,25,1);Sq=lc(Nd,{6:1},-1,33,1);c=1.52587890625E-5;for(a=32;a>=0;--a){Sq[a]=c;c*=0.5}b=1;for(a=24;a>=0;--a){Rq[a]=b;b*=0.5}}
function oo(a,b){go();var c,d;d=(Oh(),Jh);c=a;for(;b>1;b>>=1){(b&1)!=0&&(d=ei(d,c));c.e==1?(c=ei(c,c)):(c=new ri(qo(c.b,c.e,lc(Od,{6:1},-1,c.e<<1,1))))}d=ei(d,c);return d}
function nl(){nl=rr;ml=mc(Md,{6:1},-1,[48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122])}
function rm(a){var b,c;b=0;if(a.f==0){return 0}c=Zh(a);if(a.f>0){for(;c<a.e;++c){b+=Yk(a.b[c])}}else{b+=Yk(-a.b[c]);for(++c;c<a.e;++c){b+=Yk(~a.b[c])}b=(a.e<<5)-b}return b}
function ne(a,b){var c,d,e;e=a.h-b.h;if(e<0){return false}c=a.l-b.l;d=a.m-b.m+(~~c>>22);e+=~~d>>22;if(e<0){return false}a.l=c&4194303;a.m=d&4194303;a.h=e&1048575;return true}
function al(a){var b,c,d;b=lc(Md,{6:1},-1,8,1);c=(nl(),ml);d=7;if(a>=0){while(a>15){b[d--]=c[a&15];a>>=4}}else{while(d>0){b[d--]=c[a&15];a>>=4}}b[d]=c[a&15];return Gl(b,d,8)}
function vn(a,b){if(b.f==0||a.f==0){return Oh(),Nh}if(Vh(b,(Oh(),Ih))){return a}if(Vh(a,Ih)){return b}return a.f>0?b.f>0?Dn(a,b):wn(a,b):b.f>0?wn(b,a):a.e>b.e?xn(a,b):xn(b,a)}
function yn(a,b){if(b.f==0){return a}if(a.f==0){return Oh(),Nh}if(Vh(a,(Oh(),Ih))){return new Pi(En(b))}if(Vh(b,Ih)){return Nh}return a.f>0?b.f>0?Bn(a,b):Cn(a,b):b.f>0?An(a,b):zn(a,b)}
function Gf(a){var b;if(a.c!=0){return a.c}if(a.b<54){b=te(a.g);a.c=Je(qe(b,wr));a.c=33*a.c+Je(qe(Fe(b,32),wr));a.c=17*a.c+Bc(a.f);return a.c}a.c=17*a.d.hC()+Bc(a.f);return a.c}
function vg(a,b,c,d){var e,f,g,i,j;f=(j=a/b,j>0?Math.floor(j):Math.ceil(j));g=a%b;i=Gk(a*b,0);if(g!=0){e=Gk((g<=0?0-g:g)*2,b<=0?0-b:b);f+=Bg(Bc(f)&1,i*(5+e),d)}return new pg(f,c)}
function jc(a,b){var c=new Array(b);if(a==3){for(var d=0;d<b;++d){var e=new Object;e.l=e.m=e.h=0;c[d]=e}}else if(a>0){var e=[null,0,false][a];for(var d=0;d<b;++d){c[d]=e}}return c}
function tn(a,b,c,d,e){var f,g;f=ur;for(g=0;g<e;++g){f=pe(f,He(qe(ue(b[g]),yr),qe(ue(d[g]),yr)));a[g]=Je(f);f=Fe(f,32)}for(;g<c;++g){f=pe(f,qe(ue(b[g]),yr));a[g]=Je(f);f=Fe(f,32)}}
function xm(a,b,c,d){var e,f;if(d==0){nm(b,0,a,c,a.length-c)}else{f=32-d;a[a.length-1]=0;for(e=a.length-1;e>c;--e){a[e]|=~~b[e-c-1]>>>f;a[e-1]=b[e-c-1]<<d}}for(e=0;e<c;++e){a[e]=0}}
function rg(a,b,c){if(c<hf.length&&gl(a.b,b.b+jf[Bc(c)])+1<54){return new pg(a.g+b.g*hf[Bc(c)],a.f)}return new og(fn((!a.d&&(a.d=Li(a.g)),a.d),mo((!b.d&&(b.d=Li(b.g)),b.d),Bc(c))),a.f)}
function Ue(a){return $stats({moduleName:$moduleName,sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date).getTime(),type:'onModuleLoadStart',className:a})}
function vm(a,b){var c,d,e;e=a.r();if(b==0||a.r()==0){return}d=~~b>>5;a.e-=d;if(!Am(a.b,a.e,a.b,d,b&31)&&e<0){for(c=0;c<a.e&&a.b[c]==-1;++c){a.b[c]=0}c==a.e&&++a.e;++a.b[c]}Sh(a);a.c=-2}
function ve(a,b){var c,d;c=~~a.h>>19;d=~~b.h>>19;return c==0?d!=0||a.h>b.h||a.h==b.h&&a.m>b.m||a.h==b.h&&a.m==b.m&&a.l>b.l:!(d==0||a.h<b.h||a.h==b.h&&a.m<b.m||a.h==b.h&&a.m==b.m&&a.l<=b.l)}
function we(a,b){var c,d;c=~~a.h>>19;d=~~b.h>>19;return c==0?d!=0||a.h>b.h||a.h==b.h&&a.m>b.m||a.h==b.h&&a.m==b.m&&a.l>=b.l:!(d==0||a.h<b.h||a.h==b.h&&a.m<b.m||a.h==b.h&&a.m==b.m&&a.l<b.l)}
function Rm(a,b){var c,d,e;c=bl(a);d=bl(b);e=c<d?c:d;c!=0&&(a=Ge(a,c));d!=0&&(b=Ge(b,d));do{if(we(a,b)){a=He(a,b);a=Ge(a,bl(a))}else{b=He(b,a);b=Ge(b,bl(b))}}while(Ce(a,ur));return Ee(b,e)}
function Fn(a,b){if(Vh(b,(Oh(),Ih))||Vh(a,Ih)){return Ih}if(b.f==0){return a}if(a.f==0){return b}return a.f>0?b.f>0?a.e>b.e?In(a,b):In(b,a):Gn(a,b):b.f>0?Gn(b,a):Zh(b)>Zh(a)?Hn(b,a):Hn(a,b)}
function sg(a){var b,c;if(a>-140737488355328&&a<140737488355328){if(a==0){return 0}b=a<0;b&&(a=-a);c=Bc(el(Math.log(a)/0.6931471805599453));(!b||a!=Math.pow(2,c))&&++c;return c}return tg(te(a))}
function Yh(a,b){var c,d;c=a._();d=b._();if(c.r()==0){return d}else if(d.r()==0){return c}if((c.e==1||c.e==2&&c.b[1]>0)&&(d.e==1||d.e==2&&d.b[1]>0)){return Ki(Rm(ai(c),ai(d)))}return Qm(Rh(c),Rh(d))}
function ci(a,b){var c;if(b.f<=0){throw new nk(us)}if(!(a.gb(0)||b.gb(0))){throw new nk(vs)}if(b.e==1&&b.b[0]==1){return Nh}c=Wm(bi(a._(),b),b);if(c.f==0){throw new nk(vs)}c=a.f<0?rn(b,c):c;return c}
function Am(a,b,c,d,e){var f,g,i;f=true;for(g=0;g<d;++g){f=f&c[g]==0}if(e==0){nm(c,d,a,0,b)}else{i=32-e;f=f&c[g]<<i==0;for(g=0;g<b-1;++g){a[g]=~~c[g+d]>>>e|c[g+d+1]<<i}a[g]=~~c[g+d]>>>e;++g}return f}
function Ql(a){var b,c,d,e;b=0;d=a.length;e=d-4;c=0;while(c<e){b=a.charCodeAt(c+3)+31*(a.charCodeAt(c+2)+31*(a.charCodeAt(c+1)+31*(a.charCodeAt(c)+31*b)))|0;c+=4}while(c<d){b=b*31+vl(a,c++)}return b|0}
function Pm(a,b){var c,d,e,f,g;f=b.e;c=a[f]!=0;if(!c){e=b.b;c=true;for(d=f-1;d>=0;--d){if(a[d]!=e[d]){c=a[d]!=0&&ve(qe(ue(a[d]),yr),qe(ue(e[d]),yr));break}}}g=new si(1,f+1,a);c&&pn(g,b);Sh(g);return g}
function Kf(a,b){var c;c=a.f+b.f;if(a.b==0&&a.g!=-1||b.b==0&&b.g!=-1){return Ig(c)}if(a.b+b.b<54){return new pg(a.g*b.g,Dg(c))}return new dg(ei((!a.d&&(a.d=Li(a.g)),a.d),(!b.d&&(b.d=Li(b.g)),b.d)),Dg(c))}
function sp(k,a,b,c){var d=k.b[c];if(d){for(var e=0,f=d.length;e<f;++e){var g=d[e];var i=g.Rb();if(k.Ob(a,i)){var j=g.Sb();g.Tb(b);return j}}}else{d=k.b[c]=[]}var g=new Iq(a,b);d.push(g);++k.e;return null}
function an(a,b,c){var d,e,f,g,i;g=(Oh(),Jh);e=Rh(b);d=Rh(a);a.gb(0)&&Tm(e,c-1);Tm(d,c);for(f=e.ab()-1;f>=0;--f){i=Rh(g);Tm(i,c);g=ei(g,i);if((e.b[~~f>>5]&1<<(f&31))!=0){g=ei(g,d);Tm(g,c)}}Tm(g,c);return g}
function ar(a,b){var c,d,e,f,g,i,j;j=zl(a,Ks,0);i=$wnd;for(g=0;g<j.length;++g){if(!wl(j[g],'client')){br(i,j[g]);i=i[j[g]]}}c=zl(b,Ks,0);for(e=0,f=c.length;e<f;++e){d=c[e];if(!wl(Dl(d),Lr)){br(i,d);i=i[d]}}}
function gi(a,b){var c;if(b<0){throw new nk('Negative exponent')}if(b==0){return Jh}else if(b==1||a.eQ(Jh)||a.eQ(Nh)){return a}if(!a.gb(0)){c=1;while(!a.gb(c)){++c}return ei(Ai(c*b),a.fb(c).db(b))}return oo(a,b)}
function Ee(a,b){var c,d,e;b&=63;if(b<22){c=a.l<<b;d=a.m<<b|~~a.l>>22-b;e=a.h<<b|~~a.m>>22-b}else if(b<44){c=0;d=a.l<<b-22;e=a.m<<b-22|~~a.l>>44-b}else{c=0;d=0;e=a.l<<b-44}return de(c&4194303,d&4194303,e&1048575)}
function Ge(a,b){var c,d,e,f;b&=63;c=a.h&1048575;if(b<22){f=~~c>>>b;e=~~a.m>>b|c<<22-b;d=~~a.l>>b|a.m<<22-b}else if(b<44){f=0;e=~~c>>>b-22;d=~~a.m>>b-22|a.h<<44-b}else{f=0;e=0;d=~~c>>>b-44}return de(d&4194303,e&4194303,f&1048575)}
function Uo(a){Qo();switch(a){case 2:return Ao;case 1:return Bo;case 3:return Co;case 5:return Do;case 6:return Eo;case 4:return Fo;case 7:return Go;case 0:return Ho;default:throw new Sk('Invalid rounding mode');}}
function mi(a,b){var c,d,e;if(b==0){return (a.b[0]&1)!=0}if(b<0){throw new nk(ts)}e=~~b>>5;if(e>=a.e){return a.f<0}c=a.b[e];b=1<<(b&31);if(a.f<0){d=Zh(a);if(e<d){return false}else d==e?(c=-c):(c=~c)}return (c&b)!=0}
function Pf(a){var b,c;if(a.e>0){return a.e}b=1;c=1;if(a.b<54){a.b>=1&&(c=a.g);b+=Math.log(c<=0?0-c:c)*Math.LOG10E}else{b+=(a.b-1)*0.3010299956639812;Th((!a.d&&(a.d=Li(a.g)),a.d),po(b)).r()!=0&&++b}a.e=Bc(b);return a.e}
function zh(a){rf();var b,c;c=Lj(a);if(c==ks)b=Fg(a[0]);else if(c==ks)b=Gg(ue(a[0]));else if(c==ns)b=Hg(ue(a[0]),a[1]);else throw new V('Unknown call signature for bd = java.math.BigDecimal.valueOf: '+c);return new Kg(b)}
function Qi(a){Oh();var b,c;c=Lj(a);if(c==ms)b=new oi(a[0].toString());else if(c=='string number')b=new pi(a[0].toString(),a[1]);else throw new V('Unknown call signature for obj = new java.math.BigInteger: '+c);return new Pi(b)}
function Un(){Un=rr;On=new Xn(34,(Qo(),Eo));Pn=new Xn(7,Eo);Qn=new Xn(16,Eo);Rn=new Xn(0,Fo);Sn=mc(Md,{6:1},-1,[112,114,101,99,105,115,105,111,110,61]);Tn=mc(Md,{6:1},-1,[114,111,117,110,100,105,110,103,77,111,100,101,61])}
function Jn(a,b){if(b.f==0){return a}if(a.f==0){return b}if(Vh(b,(Oh(),Ih))){return new Pi(En(a))}if(Vh(a,Ih)){return new Pi(En(b))}return a.f>0?b.f>0?a.e>b.e?Mn(a,b):Mn(b,a):Kn(a,b):b.f>0?Kn(b,a):Zh(b)>Zh(a)?Ln(b,a):Ln(a,b)}
function Cn(a,b){var c,d,e,f,g,i;d=Zh(b);e=Zh(a);if(d>=a.e){return a}g=hl(a.e,b.e);f=lc(Od,{6:1},-1,g,1);c=e;for(;c<d;++c){f[c]=a.b[c]}if(c==d){f[c]=a.b[c]&b.b[c]-1;++c}for(;c<g;++c){f[c]=a.b[c]&b.b[c]}i=new si(1,g,f);Sh(i);return i}
function Wf(a){var b,c,d,e,f;b=1;c=nf.length-1;d=a.f;if(a.b==0&&a.g!=-1){return new mg(Tr)}f=(!a.d&&(a.d=Li(a.g)),a.d);while(!f.gb(0)){e=Uh(f,nf[b]);if(e[1].r()==0){d-=b;b<c&&++b;f=e[0]}else{if(b==1){break}b=1}}return new dg(f,Dg(d))}
function jo(a,b,c,d,e){var f,g,i,j;if(Ac(a)===Ac(b)&&d==e){qo(a,d,c);return}for(i=0;i<d;++i){g=ur;f=a[i];for(j=0;j<e;++j){g=pe(pe(Ae(qe(ue(f),yr),qe(ue(b[j]),yr)),qe(ue(c[i+j]),yr)),qe(ue(Je(g)),yr));c[i+j]=Je(g);g=Ge(g,32)}c[i+e]=Je(g)}}
function hi(a,b){var c,d,e,f,g;if(b.f==0){throw new nk(ss)}g=a.e;c=b.e;if((g!=c?g>c?1:-1:jn(a.b,b.b,g))==-1){return a}e=lc(Od,{6:1},-1,c,1);if(c==1){e[0]=cn(a.b,g,b.b[0])}else{d=g-c+1;e=Km(null,d,a.b,g,b.b,c)}f=new si(a.f,c,e);Sh(f);return f}
function $k(a){var b,c,d;if(a<0){return 0}else if(a==0){return 32}else{d=-(~~a>>16);b=~~d>>16&16;c=16-b;a=~~a>>b;d=a-256;b=~~d>>16&8;c+=b;a<<=b;d=a-4096;b=~~d>>16&4;c+=b;a<<=b;d=a-16384;b=~~d>>16&2;c+=b;a<<=b;d=~~a>>14;b=d&~(~~d>>1);return c+2-b}}
function kn(a,b){var c;if(a.f==0){nm(b.b,0,a.b,0,b.e)}else if(b.f==0){return}else if(a.f==b.f){hn(a.b,a.b,a.e,b.b,b.e)}else{c=un(a.b,b.b,a.e,b.e);if(c>0){tn(a.b,a.b,a.e,b.b,b.e)}else{qn(a.b,a.b,a.e,b.b,b.e);a.f=-a.f}}a.e=gl(a.e,b.e)+1;Sh(a);a.c=-2}
function ln(a,b){var c,d;c=Qh(a,b);if(a.f==0){nm(b.b,0,a.b,0,b.e);a.f=-b.f}else if(a.f!=b.f){hn(a.b,a.b,a.e,b.b,b.e);a.f=c}else{d=un(a.b,b.b,a.e,b.e);if(d>0){tn(a.b,a.b,a.e,b.b,b.e)}else{qn(a.b,a.b,a.e,b.b,b.e);a.f=-a.f}}a.e=gl(a.e,b.e)+1;Sh(a);a.c=-2}
function di(a,b,c){var d,e;if(c.f<=0){throw new nk(us)}d=a;if((c.e==1&&c.b[0]==1)|b.f>0&d.f==0){return Nh}if(d.f==0&&b.f==0){return Jh}if(b.f<0){d=ci(a,c);b=b.cb()}e=c.gb(0)?_m(d._(),b,c):Om(d._(),b,c);d.f<0&&b.gb(0)&&(e=bi(ei(rn(c,Jh),e),c));return e}
function $m(a,b,c,d,e){var f,g,i;f=ur;g=ur;for(i=0;i<d;++i){f=(go(),pe(Ae(qe(ue(c[i]),yr),qe(ue(e),yr)),qe(ue(Je(f)),yr)));g=pe(He(qe(ue(a[b+i]),yr),qe(f,yr)),g);a[b+i]=Je(g);g=Fe(g,32);f=Ge(f,32)}g=pe(He(qe(ue(a[b+d]),yr),f),g);a[b+d]=Je(g);return Je(Fe(g,32))}
function ho(a,b){go();var c,d,e,f,g,i,j,k,n;if(b.e>a.e){i=a;a=b;b=i}if(b.e<63){return no(a,b)}g=(a.e&-2)<<4;k=a.fb(g);n=b.fb(g);d=rn(a,k.eb(g));e=rn(b,n.eb(g));j=ho(k,n);c=ho(d,e);f=ho(rn(k,d),rn(e,n));f=fn(fn(f,j),c);f=f.eb(g);j=j.eb(g<<1);return fn(fn(j,f),c)}
function le(a){var b,c,d;c=a.l;if((c&c-1)!=0){return -1}d=a.m;if((d&d-1)!=0){return -1}b=a.h;if((b&b-1)!=0){return -1}if(b==0&&d==0&&c==0){return -1}if(b==0&&d==0&&c!=0){return _k(c)}if(b==0&&d!=0&&c==0){return _k(d)+22}if(b!=0&&d==0&&c==0){return _k(b)+44}return -1}
function wn(a,b){var c,d,e,f,g,i,j;e=Zh(a);d=Zh(b);if(d>=a.e){return Oh(),Nh}i=a.e;g=lc(Od,{6:1},-1,i,1);c=e>d?e:d;if(c==d){g[c]=-b.b[c]&a.b[c];++c}f=hl(b.e,a.e);for(;c<f;++c){g[c]=~b.b[c]&a.b[c]}if(c>=b.e){for(;c<a.e;++c){g[c]=a.b[c]}}j=new si(1,i,g);Sh(j);return j}
function Jf(a,b){if(a.b==0&&a.g!=-1){return Ig(b>0?b:0)}if(b>=0){if(a.b<54){return new pg(a.g,Dg(b))}return new dg((!a.d&&(a.d=Li(a.g)),a.d),Dg(b))}if(-b<hf.length&&a.b+jf[Bc(-b)]<54){return new pg(a.g*hf[Bc(-b)],0)}return new dg(mo((!a.d&&(a.d=Li(a.g)),a.d),Bc(-b)),0)}
function Fe(a,b){var c,d,e,f,g;b&=63;c=a.h;d=(c&524288)!=0;d&&(c|=-1048576);if(b<22){g=~~c>>b;f=~~a.m>>b|c<<22-b;e=~~a.l>>b|a.m<<22-b}else if(b<44){g=d?1048575:0;f=~~c>>b-22;e=~~a.m>>b-22|c<<44-b}else{g=d?1048575:0;f=d?4194303:0;e=~~c>>b-44}return de(e&4194303,f&4194303,g&1048575)}
function Oh(){Oh=rr;var a;Jh=new qi(1,1);Lh=new qi(1,10);Nh=new qi(0,0);Ih=new qi(-1,1);Kh=mc(Xd,{6:1},17,[Nh,Jh,new qi(1,2),new qi(1,3),new qi(1,4),new qi(1,5),new qi(1,6),new qi(1,7),new qi(1,8),new qi(1,9),Lh]);Mh=lc(Xd,{6:1},17,32,0);for(a=0;a<Mh.length;++a){nc(Mh,a,Ki(Ee(sr,a)))}}
function lo(a,b){go();var c,d,e,f,g,i,j,k,n;k=a.f;if(k==0){return Oh(),Nh}d=a.e;c=a.b;if(d==1){e=Ae(qe(ue(c[0]),yr),qe(ue(b),yr));j=Je(e);g=Je(Ge(e,32));return g==0?new qi(k,j):new si(k,2,mc(Od,{6:1},-1,[j,g]))}i=d+1;f=lc(Od,{6:1},-1,i,1);f[d]=ko(f,c,d,b);n=new si(k,i,f);Sh(n);return n}
function no(a,b){var c,d,e,f,g,i,j,k,n,o,q;d=a.e;f=b.e;i=d+f;j=a.f!=b.f?-1:1;if(i==2){n=Ae(qe(ue(a.b[0]),yr),qe(ue(b.b[0]),yr));q=Je(n);o=Je(Ge(n,32));return o==0?new qi(j,q):new si(j,2,mc(Od,{6:1},-1,[q,o]))}c=a.b;e=b.b;g=lc(Od,{6:1},-1,i,1);io(c,d,e,f,g);k=new si(j,i,g);Sh(k);return k}
function Hn(a,b){var c,d,e,f,g,i;d=Zh(b);e=Zh(a);if(e>=b.e){return b}else if(d>=a.e){return a}g=hl(a.e,b.e);f=lc(Od,{6:1},-1,g,1);if(d==e){f[e]=-(-a.b[e]|-b.b[e]);c=e}else{for(c=d;c<e;++c){f[c]=b.b[c]}f[c]=b.b[c]&a.b[c]-1}for(++c;c<g;++c){f[c]=a.b[c]&b.b[c]}i=new si(-1,g,f);Sh(i);return i}
function zm(a,b){var c,d,e,f,g;d=~~b>>5;b&=31;if(d>=a.e){return a.f<0?(Oh(),Ih):(Oh(),Nh)}f=a.e-d;e=lc(Od,{6:1},-1,f+1,1);Am(e,f,a.b,d,b);if(a.f<0){for(c=0;c<d&&a.b[c]==0;++c){}if(c<d||b>0&&a.b[c]<<32-b!=0){for(c=0;c<f&&e[c]==-1;++c){e[c]=0}c==f&&++f;++e[c]}}g=new si(a.f,f,e);Sh(g);return g}
function vo(a,b){uo();var c,d;if(b<=0||a.e==1&&a.b[0]==2){return true}if(!mi(a,0)){return false}if(a.e==1&&(a.b[0]&-1024)==0){return Bq(to,a.b[0])>=0}for(d=1;d<to.length;++d){if(cn(a.b,a.e,to[d])==0){return false}}c=sm(a);for(d=2;c<ro[d];++d){}b=d<1+(~~(b-1)>>1)?d:1+(~~(b-1)>>1);return wo(a,b)}
function Qm(a,b){var c,d,e,f;c=a.bb();d=b.bb();e=c<d?c:d;vm(a,c);vm(b,d);if(Qh(a,b)==1){f=a;a=b;b=f}do{if(b.e==1||b.e==2&&b.b[1]>0){b=Ki(Rm(ai(a),ai(b)));break}if(b.e>a.e*1.2){b=hi(b,a);b.r()!=0&&vm(b,b.bb())}else{do{pn(b,a);vm(b,b.bb())}while(Qh(b,a)>=0)}f=b;b=a;a=f}while(f.f!=0);return b.eb(e)}
function Sf(a,b,c){var d;if(!c){throw new jl}d=b-a.f;if(d==0){return a}if(d>0){if(d<hf.length&&a.b+jf[Bc(d)]<54){return new pg(a.g*hf[Bc(d)],b)}return new dg(mo((!a.d&&(a.d=Li(a.g)),a.d),Bc(d)),b)}if(a.b<54&&-d<hf.length){return vg(a.g,hf[Bc(-d)],b,c)}return ug((!a.d&&(a.d=Li(a.g)),a.d),po(-d),b,c)}
function cl(a,b){var c,d,e,f;if(b==10||b<2||b>36){return Lr+Ke(a)}c=lc(Md,{6:1},-1,65,1);d=(nl(),ml);e=64;f=ue(b);if(we(a,ur)){while(we(a,f)){c[e--]=d[Je(ze(a,f))];a=ee(a,f,false)}c[e]=d[Je(a)]}else{while(ye(a,Be(f))){c[e--]=d[Je(Be(ze(a,f)))];a=ee(a,f,false)}c[e--]=d[Je(Be(a))];c[e]=45}return Gl(c,e,65)}
function Of(a,b,c){var d,e,f,g,i,j;f=b<0?-b:b;g=c.b;e=Bc(fl(f))+1;i=c;if(b==0||a.b==0&&a.g!=-1&&b>0){return Nf(a,b)}if(f>999999999||g==0&&b<0||g>0&&e>g){throw new nk(bs)}g>0&&(i=new Xn(g+e+1,c.c));d=Qf(a,i);j=~~Zk(f)>>1;while(j>0){d=Lf(d,d,i);(f&j)==j&&(d=Lf(d,a,i));j>>=1}b<0&&(d=zf(lf,d,i));If(d,c);return d}
function tf(a,b){var c;c=a.f-b.f;if(a.b==0&&a.g!=-1){if(c<=0){return b}if(b.b==0&&b.g!=-1){return a}}else if(b.b==0&&b.g!=-1){if(c>=0){return a}}if(c==0){if(gl(a.b,b.b)+1<54){return new pg(a.g+b.g,a.f)}return new og(fn((!a.d&&(a.d=Li(a.g)),a.d),(!b.d&&(b.d=Li(b.g)),b.d)),a.f)}else return c>0?rg(a,b,c):rg(b,a,-c)}
function Nm(a,b){var c,d,e,f,g;d=qe(ue(b),yr);if(we(a,ur)){f=ee(a,d,false);g=ze(a,d)}else{c=Ge(a,1);e=ue(~~b>>>1);f=ee(c,e,false);g=ze(c,e);g=pe(Ee(g,1),qe(a,sr));if((b&1)!=0){if(!ve(f,g)){g=He(g,f)}else{if(ye(He(f,g),d)){g=pe(g,He(d,f));f=He(f,sr)}else{g=pe(g,He(Ee(d,1),f));f=He(f,vr)}}}}return De(Ee(g,32),qe(f,yr))}
function Ei(a,b,c){var d,e,f,g,i,j,k,n,o,q,r,s,t,u;r=b.length;k=r;if(b.charCodeAt(0)==45){o=-1;q=1;--r}else{o=1;q=0}g=(Em(),Dm)[c];f=~~(r/g);u=r%g;u!=0&&++f;j=lc(Od,{6:1},-1,f,1);d=Cm[c-2];i=0;s=q+(u==0?g:u);for(t=q;t<k;t=s,s=s+g){e=af(b.substr(t,s-t),c);n=(go(),ko(j,j,i,d));n+=on(j,i,e);j[i++]=n}a.f=o;a.e=i;a.b=j;Sh(a)}
function te(a){var b,c,d,e,f;if(isNaN(a)){return Qe(),Pe}if(a<-9223372036854775808){return Qe(),Ne}if(a>=9223372036854775807){return Qe(),Me}e=false;if(a<0){e=true;a=-a}d=0;if(a>=17592186044416){d=Bc(a/17592186044416);a-=d*17592186044416}c=0;if(a>=4194304){c=Bc(a/4194304);a-=c*4194304}b=Bc(a);f=de(b,c,d);e&&je(f);return f}
function Ke(a){var b,c,d,e,f;if(a.l==0&&a.m==0&&a.h==0){return Tr}if(a.h==524288&&a.m==0&&a.l==0){return '-9223372036854775808'}if(~~a.h>>19!=0){return Ur+Ke(Be(a))}c=a;d=Lr;while(!(c.l==0&&c.m==0&&c.h==0)){e=ue(1000000000);c=ee(c,e,true);b=Lr+Je(ae);if(!(c.l==0&&c.m==0&&c.h==0)){f=9-b.length;for(;f>0;--f){b=Tr+b}}d=b+d}return d}
function Uh(a,b){var c,d,e,f,g,i,j,k,n,o,q,r,s;f=b.f;if(f==0){throw new nk(ss)}e=b.e;d=b.b;if(e==1){return Lm(a,d[0],f)}q=a.b;r=a.e;c=r!=e?r>e?1:-1:jn(q,d,r);if(c<0){return mc(Xd,{6:1},17,[Nh,a])}s=a.f;i=r-e+1;j=s==f?1:-1;g=lc(Od,{6:1},-1,i,1);k=Km(g,i,q,r,d,e);n=new si(j,i,g);o=new si(s,e,k);Sh(n);Sh(o);return mc(Xd,{6:1},17,[n,o])}
function Zf(a){var b;if(a.f==0||a.b==0&&a.g!=-1){return !a.d&&(a.d=Li(a.g)),a.d}else if(a.f<0){return ei((!a.d&&(a.d=Li(a.g)),a.d),po(-a.f))}else{if(a.f>(a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)||a.f>(!a.d&&(a.d=Li(a.g)),a.d).bb()){throw new nk(cs)}b=Uh((!a.d&&(a.d=Li(a.g)),a.d),po(a.f));if(b[1].r()!=0){throw new nk(cs)}return b[0]}}
function qn(a,b,c,d,e){var f,g;f=ur;if(c<e){for(g=0;g<c;++g){f=pe(f,He(qe(ue(d[g]),yr),qe(ue(b[g]),yr)));a[g]=Je(f);f=Fe(f,32)}for(;g<e;++g){f=pe(f,qe(ue(d[g]),yr));a[g]=Je(f);f=Fe(f,32)}}else{for(g=0;g<e;++g){f=pe(f,He(qe(ue(d[g]),yr),qe(ue(b[g]),yr)));a[g]=Je(f);f=Fe(f,32)}for(;g<c;++g){f=He(f,qe(ue(b[g]),yr));a[g]=Je(f);f=Fe(f,32)}}}
function Lm(a,b,c){var d,e,f,g,i,j,k,n,o,q,r,s;q=a.b;r=a.e;s=a.f;if(r==1){d=qe(ue(q[0]),yr);e=qe(ue(b),yr);f=ee(d,e,false);j=ze(d,e);s!=c&&(f=Be(f));s<0&&(j=Be(j));return mc(Xd,{6:1},17,[Ki(f),Ki(j)])}i=s==c?1:-1;g=lc(Od,{6:1},-1,r,1);k=mc(Od,{6:1},-1,[Mm(g,q,r,b)]);n=new si(i,r,g);o=new si(s,1,k);Sh(n);Sh(o);return mc(Xd,{6:1},17,[n,o])}
function Zm(a,b,c){var d,e,f,g,i,j,k;i=b.b;j=b.e;k=ur;for(d=0;d<j;++d){e=ur;g=Je((go(),Ae(qe(ue(a[d]),yr),qe(ue(c),yr))));for(f=0;f<j;++f){e=pe(pe(Ae(qe(ue(g),yr),qe(ue(i[f]),yr)),qe(ue(a[d+f]),yr)),qe(ue(Je(e)),yr));a[d+f]=Je(e);e=Ge(e,32)}k=pe(k,pe(qe(ue(a[d+j]),yr),e));a[d+j]=Je(k);k=Ge(k,32)}a[j<<1]=Je(k);for(f=0;f<j+1;++f){a[f]=a[f+j]}}
function af(a,b){var c,d,e,f;if(a==null){throw new pl(Mr)}if(b<2||b>36){throw new pl('radix '+b+' out of range')}d=a.length;e=d>0&&a.charCodeAt(0)==45?1:0;for(c=e;c<d;++c){if(tk(a.charCodeAt(c),b)==-1){throw new pl(Zr+a+$r)}}f=parseInt(a,b);if(isNaN(f)){throw new pl(Zr+a+$r)}else if(f<-2147483648||f>2147483647){throw new pl(Zr+a+$r)}return f}
function En(a){var b,c;if(a.f==0){return Oh(),Ih}if(Vh(a,(Oh(),Ih))){return Nh}c=lc(Od,{6:1},-1,a.e+1,1);if(a.f>0){if(a.b[a.e-1]!=-1){for(b=0;a.b[b]==-1;++b){}}else{for(b=0;b<a.e&&a.b[b]==-1;++b){}if(b==a.e){c[b]=1;return new si(-a.f,b+1,c)}}}else{for(b=0;a.b[b]==0;++b){c[b]=-1}}c[b]=a.b[b]+a.f;for(++b;b<a.e;++b){c[b]=a.b[b]}return new si(-a.f,b,c)}
function Bg(a,b,c){var d;d=0;switch(c.c){case 7:if(b!=0){throw new nk(cs)}break;case 0:d=b==0?0:b<0?-1:1;break;case 2:d=(b==0?0:b<0?-1:1)>0?b==0?0:b<0?-1:1:0;break;case 3:d=(b==0?0:b<0?-1:1)<0?b==0?0:b<0?-1:1:0;break;case 4:(b<0?-b:b)>=5&&(d=b==0?0:b<0?-1:1);break;case 5:(b<0?-b:b)>5&&(d=b==0?0:b<0?-1:1);break;case 6:(b<0?-b:b)+a>5&&(d=b==0?0:b<0?-1:1);}return d}
function Vf(a,b,c){var d,e,f,g,i,j;i=te(hf[c]);g=He(te(a.f),ue(c));j=te(a.g);f=ee(j,i,false);e=ze(j,i);if(Ce(e,ur)){d=se(He(Ee(xe(e,ur)?Be(e):e,1),i),ur)?0:xe(He(Ee(xe(e,ur)?Be(e):e,1),i),ur)?-1:1;f=pe(f,ue(Bg(Je(f)&1,(se(e,ur)?0:xe(e,ur)?-1:1)*(5+d),b.c)));if(fl(Ie(xe(f,ur)?Be(f):f))>=b.b){f=re(f,tr);g=He(g,sr)}}a.f=Dg(Ie(g));a.e=b.b;a.g=Ie(f);a.b=tg(f);a.d=null}
function tm(a,b){var c,d,e,f,g,i,j,k,n;k=a.f==0?1:a.f;g=~~b>>5;c=b&31;j=gl(g+1,a.e)+1;i=lc(Od,{6:1},-1,j,1);d=1<<c;nm(a.b,0,i,0,a.e);if(a.f<0){if(g>=a.e){i[g]=d}else{e=Zh(a);if(g>e){i[g]^=d}else if(g<e){i[g]=-d;for(f=g+1;f<e;++f){i[f]=-1}i[f]=i[f]--}else{f=g;i[g]=-(-i[g]^d);if(i[g]==0){for(++f;i[f]==-1;++f){i[f]=0}++i[f]}}}}else{i[g]^=d}n=new si(k,j,i);Sh(n);return n}
function wo(a,b){var c,d,e,f,g,i,j,k,n;g=rn(a,(Oh(),Jh));c=g.ab();f=g.bb();i=g.fb(f);j=new Vq;for(d=0;d<b;++d){if(d<to.length){k=so[d]}else{do{k=new ni(c,j)}while(Qh(k,a)>=0||k.f==0||k.e==1&&k.b[0]==1)}n=di(k,i,a);if(n.e==1&&n.b[0]==1||n.eQ(g)){continue}for(e=1;e<f;++e){if(n.eQ(g)){continue}n=bi(ei(n,n),a);if(n.e==1&&n.b[0]==1){return false}}if(!n.eQ(g)){return false}}return true}
function Mm(a,b,c,d){var e,f,g,i,j,k,n;k=ur;f=qe(ue(d),yr);for(i=c-1;i>=0;--i){n=De(Ee(k,32),qe(ue(b[i]),yr));if(we(n,ur)){j=ee(n,f,false);k=ze(n,f)}else{e=Ge(n,1);g=ue(~~d>>>1);j=ee(e,g,false);k=ze(e,g);k=pe(Ee(k,1),qe(n,sr));if((d&1)!=0){if(!ve(j,k)){k=He(k,j)}else{if(ye(He(j,k),f)){k=pe(k,He(f,j));j=He(j,sr)}else{k=pe(k,He(Ee(f,1),j));j=He(j,vr)}}}}a[i]=Je(qe(j,yr))}return Je(k)}
function he(a,b,c,d,e,f){var g,i,j,k,n,o,q;k=ke(b)-ke(a);g=Ee(b,k);j=de(0,0,0);while(k>=0){i=ne(a,g);if(i){k<22?(j.l|=1<<k,undefined):k<44?(j.m|=1<<k-22,undefined):(j.h|=1<<k-44,undefined);if(a.l==0&&a.m==0&&a.h==0){break}}o=g.m;q=g.h;n=g.l;g.h=~~q>>>1;g.m=~~o>>>1|(q&1)<<21;g.l=~~n>>>1|(o&1)<<21;--k}c&&je(j);if(f){if(d){ae=Be(a);e&&(ae=He(ae,(Qe(),Oe)))}else{ae=de(a.l,a.m,a.h)}}return j}
function dn(a,b,c,d,e){var f,g,i,j,k,n,o;k=lc(Xd,{6:1},17,8,0);n=a;nc(k,0,b);o=Ym(b,b,d,e);for(g=1;g<=7;++g){nc(k,g,Ym(k[g-1],o,d,e))}for(g=c.ab()-1;g>=0;--g){if((c.b[~~g>>5]&1<<(g&31))!=0){j=1;f=g;for(i=g-3>0?g-3:0;i<=g-1;++i){if((c.b[~~i>>5]&1<<(i&31))!=0){if(i<f){f=i;j=j<<g-i^1}else{j=j^1<<i-f}}}for(i=f;i<=g;++i){n=Ym(n,n,d,e)}n=Ym(k[~~(j-1)>>1],n,d,e);g=f}else{n=Ym(n,n,d,e)}}return n}
function Ln(a,b){var c,d,e,f,g,i,j;i=gl(a.e,b.e);g=lc(Od,{6:1},-1,i,1);e=Zh(a);d=Zh(b);c=d;if(e==d){g[d]=-a.b[d]^-b.b[d]}else{g[d]=-b.b[d];f=hl(b.e,e);for(++c;c<f;++c){g[c]=~b.b[c]}if(c==b.e){for(;c<e;++c){g[c]=-1}g[c]=a.b[c]-1}else{g[c]=-a.b[c]^~b.b[c]}}f=hl(a.e,b.e);for(++c;c<f;++c){g[c]=a.b[c]^b.b[c]}for(;c<a.e;++c){g[c]=a.b[c]}for(;c<b.e;++c){g[c]=b.b[c]}j=new si(1,i,g);Sh(j);return j}
function qo(a,b,c){var d,e,f,g;for(e=0;e<b;++e){d=ur;for(g=e+1;g<b;++g){d=pe(pe(Ae(qe(ue(a[e]),yr),qe(ue(a[g]),yr)),qe(ue(c[e+g]),yr)),qe(ue(Je(d)),yr));c[e+g]=Je(d);d=Ge(d,32)}c[e+b]=Je(d)}ym(c,c,b<<1);d=ur;for(e=0,f=0;e<b;++e,++f){d=pe(pe(Ae(qe(ue(a[e]),yr),qe(ue(a[e]),yr)),qe(ue(c[f]),yr)),qe(ue(Je(d)),yr));c[f]=Je(d);d=Ge(d,32);++f;d=pe(d,qe(ue(c[f]),yr));c[f]=Je(d);d=Ge(d,32)}return c}
function vf(a,b){var c,d,e,f,g,i;e=Uf(a);i=Uf(b);if(e==i){if(a.f==b.f&&a.b<54&&b.b<54){return a.g<b.g?-1:a.g>b.g?1:0}d=a.f-b.f;c=(a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)-(b.e>0?b.e:el((b.b-1)*0.3010299956639812)+1);if(c>d+1){return e}else if(c<d-1){return -e}else{f=(!a.d&&(a.d=Li(a.g)),a.d);g=(!b.d&&(b.d=Li(b.g)),b.d);d<0?(f=ei(f,po(-d))):d>0&&(g=ei(g,po(d)));return Qh(f,g)}}else return e<i?-1:1}
function If(a,b){var c,d,e,f,g,i,j;f=b.b;if((a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)-f<0||f==0){return}d=a.q()-f;if(d<=0){return}if(a.b<54){Vf(a,b,d);return}i=po(d);e=Uh((!a.d&&(a.d=Li(a.g)),a.d),i);g=a.f-d;if(e[1].r()!=0){c=Qh(ki(e[1]._()),i);c=Bg(e[0].gb(0)?1:0,e[1].r()*(5+c),b.c);c!=0&&nc(e,0,fn(e[0],Ki(ue(c))));j=new cg(e[0]);if(j.q()>f){nc(e,0,Th(e[0],(Oh(),Lh)));--g}}a.f=Dg(g);a.e=f;Tf(a,e[0])}
function Yf(a,b,c){var d,e,f,g;d=b.f-a.f;if(b.b==0&&b.g!=-1||a.b==0&&a.g!=-1||c.b==0){return Qf(Xf(a,b),c)}if((b.e>0?b.e:el((b.b-1)*0.3010299956639812)+1)<d-1){if(c.b<(a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)){g=Uf(a);if(g!=b.r()){f=fn(lo((!a.d&&(a.d=Li(a.g)),a.d),10),Ki(ue(g)))}else{f=rn((!a.d&&(a.d=Li(a.g)),a.d),Ki(ue(g)));f=fn(lo(f,10),Ki(ue(g*9)))}e=new og(f,a.f+1);return Qf(e,c)}}return Qf(Xf(a,b),c)}
function rn(a,b){var c,d,e,f,g,i,j,k,n,o;g=a.f;j=b.f;if(j==0){return a}if(g==0){return b.cb()}f=a.e;i=b.e;if(f+i==2){c=qe(ue(a.b[0]),yr);d=qe(ue(b.b[0]),yr);g<0&&(c=Be(c));j<0&&(d=Be(d));return Ki(He(c,d))}e=f!=i?f>i?1:-1:jn(a.b,b.b,f);if(e==-1){o=-j;n=g==j?sn(b.b,i,a.b,f):gn(b.b,i,a.b,f)}else{o=g;if(g==j){if(e==0){return Oh(),Nh}n=sn(a.b,f,b.b,i)}else{n=gn(a.b,f,b.b,i)}}k=new si(o,n.length,n);Sh(k);return k}
function zn(a,b){var c,d,e,f,g,i,j;e=Zh(a);d=Zh(b);if(e>=b.e){return Oh(),Nh}i=b.e;g=lc(Od,{6:1},-1,i,1);c=e;if(e<d){g[e]=-a.b[e];f=hl(a.e,d);for(++c;c<f;++c){g[c]=~a.b[c]}if(c==a.e){for(;c<d;++c){g[c]=-1}g[c]=b.b[c]-1}else{g[c]=~a.b[c]&b.b[c]-1}}else d<e?(g[e]=-a.b[e]&b.b[e]):(g[e]=-a.b[e]&b.b[e]-1);f=hl(a.e,b.e);for(++c;c<f;++c){g[c]=~a.b[c]&b.b[c]}for(;c<b.e;++c){g[c]=b.b[c]}j=new si(1,i,g);Sh(j);return j}
function Th(a,b){var c,d,e,f,g,i,j,k,n,o;if(b.f==0){throw new nk(ss)}e=b.f;if(b.e==1&&b.b[0]==1){return b.f>0?a:a.cb()}n=a.f;k=a.e;d=b.e;if(k+d==2){o=re(qe(ue(a.b[0]),yr),qe(ue(b.b[0]),yr));n!=e&&(o=Be(o));return Ki(o)}c=k!=d?k>d?1:-1:jn(a.b,b.b,k);if(c==0){return n==e?Jh:Ih}if(c==-1){return Nh}g=k-d+1;f=lc(Od,{6:1},-1,g,1);i=n==e?1:-1;d==1?Mm(f,a.b,k,b.b[0]):Km(f,g,a.b,k,b.b,d);j=new si(i,g,f);Sh(j);return j}
function hn(a,b,c,d,e){var f,g;f=pe(qe(ue(b[0]),yr),qe(ue(d[0]),yr));a[0]=Je(f);f=Fe(f,32);if(c>=e){for(g=1;g<e;++g){f=pe(f,pe(qe(ue(b[g]),yr),qe(ue(d[g]),yr)));a[g]=Je(f);f=Fe(f,32)}for(;g<c;++g){f=pe(f,qe(ue(b[g]),yr));a[g]=Je(f);f=Fe(f,32)}}else{for(g=1;g<c;++g){f=pe(f,pe(qe(ue(b[g]),yr),qe(ue(d[g]),yr)));a[g]=Je(f);f=Fe(f,32)}for(;g<e;++g){f=pe(f,qe(ue(d[g]),yr));a[g]=Je(f);f=Fe(f,32)}}Ce(f,ur)&&(a[g]=Je(f))}
function go(){go=rr;var a,b;bo=lc(Xd,{6:1},17,32,0);co=lc(Xd,{6:1},17,32,0);eo=mc(Od,{6:1},-1,[1,5,25,125,625,3125,15625,78125,390625,1953125,9765625,48828125,244140625,1220703125]);fo=mc(Od,{6:1},-1,[1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000]);a=sr;for(b=0;b<=18;++b){nc(bo,b,Ki(a));nc(co,b,Ki(Ee(a,b)));a=Ae(a,Hr)}for(;b<co.length;++b){nc(bo,b,ei(bo[b-1],bo[1]));nc(co,b,ei(co[b-1],(Oh(),Lh)))}}
function yf(a,b,c,d){var e,f,g;if(!d){throw new jl}if(b.b==0&&b.g!=-1){throw new nk(_r)}e=a.f-b.f-c;if(a.b<54&&b.b<54){if(e==0){return vg(a.g,b.g,c,d)}else if(e>0){if(e<hf.length&&b.b+jf[Bc(e)]<54){return vg(a.g,b.g*hf[Bc(e)],c,d)}}else{if(-e<hf.length&&a.b+jf[Bc(-e)]<54){return vg(a.g*hf[Bc(-e)],b.g,c,d)}}}f=(!a.d&&(a.d=Li(a.g)),a.d);g=(!b.d&&(b.d=Li(b.g)),b.d);e>0?(g=mo(g,Bc(e))):e<0&&(f=mo(f,Bc(-e)));return ug(f,g,c,d)}
function Gn(a,b){var c,d,e,f,g,i,j;d=Zh(b);e=Zh(a);if(e>=b.e){return b}i=b.e;g=lc(Od,{6:1},-1,i,1);if(d<e){for(c=d;c<e;++c){g[c]=b.b[c]}}else if(e<d){c=e;g[e]=-a.b[e];f=hl(a.e,d);for(++c;c<f;++c){g[c]=~a.b[c]}if(c!=a.e){g[c]=~(-b.b[c]|a.b[c])}else{for(;c<d;++c){g[c]=-1}g[c]=b.b[c]-1}++c}else{c=e;g[e]=-(-b.b[e]|a.b[e]);++c}f=hl(b.e,a.e);for(;c<f;++c){g[c]=b.b[c]&~a.b[c]}for(;c<b.e;++c){g[c]=b.b[c]}j=new si(-1,i,g);Sh(j);return j}
function _f(a){var b,c,d,e;d=Hm((!a.d&&(a.d=Li(a.g)),a.d),0);if(a.f==0||a.b==0&&a.g!=-1&&a.f<0){return d}b=Uf(a)<0?1:0;c=a.f;e=new gm(d.length+1+dl(Bc(a.f)));b==1&&(e.b.b+=Ur,e);if(a.f>0){c-=d.length-b;if(c>=0){e.b.b+=es;for(;c>ef.length;c-=ef.length){$l(e,ef)}_l(e,ef,Bc(c));dm(e,Al(d,b))}else{c=b-c;dm(e,Bl(d,b,Bc(c)));e.b.b+=ds;dm(e,Al(d,Bc(c)))}}else{dm(e,Al(d,b));for(;c<-ef.length;c+=ef.length){$l(e,ef)}_l(e,ef,Bc(-c))}return e.b.b}
function ug(a,b,c,d){var e,f,g,i,j,k,n;g=Uh(a,b);i=g[0];k=g[1];if(k.r()==0){return new dg(i,c)}n=a.r()*b.r();if(b.ab()<54){j=ai(k);f=ai(b);e=se(He(Ee(xe(j,ur)?Be(j):j,1),xe(f,ur)?Be(f):f),ur)?0:xe(He(Ee(xe(j,ur)?Be(j):j,1),xe(f,ur)?Be(f):f),ur)?-1:1;e=Bg(i.gb(0)?1:0,n*(5+e),d)}else{e=Qh(ki(k._()),b._());e=Bg(i.gb(0)?1:0,n*(5+e),d)}if(e!=0){if(i.ab()<54){return Hg(pe(ai(i),ue(e)),c)}i=fn(i,Ki(ue(e)));return new dg(i,c)}return new dg(i,c)}
function ag(a){var b,c,d,e,f;if(a.i!=null){return a.i}if(a.b<32){a.i=Im(te(a.g),Bc(a.f));return a.i}e=Hm((!a.d&&(a.d=Li(a.g)),a.d),0);if(a.f==0){return e}b=(!a.d&&(a.d=Li(a.g)),a.d).r()<0?2:1;c=e.length;d=-a.f+c-b;f=new fm;cc(f.b,e);if(a.f>0&&d>=-6){if(d>=0){em(f,c-Bc(a.f),ds)}else{ec(f.b,b-1,b-1,es);em(f,b+1,Ll(ef,0,-Bc(d)-1))}}else{if(c-b>=1){ec(f.b,b,b,ds);++c}ec(f.b,c,c,fs);d>0&&em(f,++c,gs);em(f,++c,Lr+Ke(te(d)))}a.i=f.b.b;return a.i}
function xn(a,b){var c,d,e,f,g,i,j;e=Zh(a);f=Zh(b);if(e>=b.e){return a}d=f>e?f:e;f>e?(c=-b.b[d]&~a.b[d]):f<e?(c=~b.b[d]&-a.b[d]):(c=-b.b[d]&-a.b[d]);if(c==0){for(++d;d<b.e&&(c=~(a.b[d]|b.b[d]))==0;++d){}if(c==0){for(;d<a.e&&(c=~a.b[d])==0;++d){}if(c==0){i=a.e+1;g=lc(Od,{6:1},-1,i,1);g[i-1]=1;j=new si(-1,i,g);return j}}}i=a.e;g=lc(Od,{6:1},-1,i,1);g[d]=-c;for(++d;d<b.e;++d){g[d]=a.b[d]|b.b[d]}for(;d<a.e;++d){g[d]=a.b[d]}j=new si(-1,i,g);return j}
function zl(o,a,b){var c=new RegExp(a,'g');var d=[];var e=0;var f=o;var g=null;while(true){var i=c.exec(f);if(i==null||f==Lr||e==b-1&&b>0){d[e]=f;break}else{d[e]=f.substring(0,i.index);f=f.substring(i.index+i[0].length,f.length);c.lastIndex=0;if(g==f){d[e]=f.substring(0,1);f=f.substring(1)}g=f;e++}}if(b==0&&o.length>0){var j=d.length;while(j>0&&d[j-1]==Lr){--j}j<d.length&&d.splice(j,d.length-j)}var k=Fl(d.length);for(var n=0;n<d.length;++n){k[n]=d[n]}return k}
function po(a){go();var b,c,d,e;b=Bc(a);if(a<co.length){return co[b]}else if(a<=50){return (Oh(),Lh).db(b)}else if(a<=1000){return bo[1].db(b).eb(b)}if(a>1000000){throw new nk('power of ten too big')}if(a<=2147483647){return bo[1].db(b).eb(b)}d=bo[1].db(2147483647);e=d;c=te(a-2147483647);b=Bc(a%2147483647);while(ve(c,Ir)){e=ei(e,d);c=He(c,Ir)}e=ei(e,bo[1].db(b));e=e.eb(2147483647);c=te(a-2147483647);while(ve(c,Ir)){e=e.eb(2147483647);c=He(c,Ir)}e=e.eb(b);return e}
function $d(){var a;!!$stats&&Ue('com.iriscouch.gwtapp.client.BigDecimalApp');ik(new kk);Wj(new Yj);Gj(new Ij);Ch(new Eh);!!$stats&&Ue('com.google.gwt.user.client.UserAgentAsserter');a=We();wl(Sr,a)||($wnd.alert('ERROR: Possible problem with your *.gwt.xml module file.\nThe compile time user.agent value (safari) does not match the runtime user.agent value ('+a+'). Expect more errors.\n'),undefined);!!$stats&&Ue('com.google.gwt.user.client.DocumentModeAsserter');Ve()}
function Vo(a){Qo();var b,c,d,e,f;if(a==null){throw new jl}d=Cl(a);c=d.length;if(c<Po.length||c>Oo.length){throw new Rk}f=null;e=null;if(d[0]==67){e=Ao;f=Io}else if(d[0]==68){e=Bo;f=Jo}else if(d[0]==70){e=Co;f=Ko}else if(d[0]==72){if(c>6){if(d[5]==68){e=Do;f=Lo}else if(d[5]==69){e=Eo;f=Mo}else if(d[5]==85){e=Fo;f=No}}}else if(d[0]==85){if(d[1]==80){e=Ho;f=Po}else if(d[1]==78){e=Go;f=Oo}}if(!!e&&c==f.length){for(b=1;b<c&&d[b]==f[b];++b){}if(b==c){return e}}throw new Rk}
function ni(a,b){var d,e,f,g,i,j;Oh();var c;if(a<0){throw new Sk('numBits must be non-negative')}if(a==0){this.f=0;this.e=1;this.b=mc(Od,{6:1},-1,[0])}else{this.f=1;this.e=~~(a+31)>>5;this.b=lc(Od,{6:1},-1,this.e,1);for(c=0;c<this.e;++c){this.b[c]=Bc((g=b.b*15525485+b.c*1502,j=b.c*15525485+11,d=Math.floor(j*5.9604644775390625E-8),g+=d,j-=d*16777216,g%=16777216,b.b=g,b.c=j,f=b.b*256,i=el(b.c*Sq[32]),e=f+i,e>=2147483648&&(e-=4294967296),e))}this.b[this.e-1]>>>=-a&31;Sh(this)}}
function fn(a,b){var c,d,e,f,g,i,j,k,n,o,q,r;g=a.f;j=b.f;if(g==0){return b}if(j==0){return a}f=a.e;i=b.e;if(f+i==2){c=qe(ue(a.b[0]),yr);d=qe(ue(b.b[0]),yr);if(g==j){k=pe(c,d);r=Je(k);q=Je(Ge(k,32));return q==0?new qi(g,r):new si(g,2,mc(Od,{6:1},-1,[r,q]))}return Ki(g<0?He(d,c):He(c,d))}else if(g==j){o=g;n=f>=i?gn(a.b,f,b.b,i):gn(b.b,i,a.b,f)}else{e=f!=i?f>i?1:-1:jn(a.b,b.b,f);if(e==0){return Oh(),Nh}if(e==1){o=g;n=sn(a.b,f,b.b,i)}else{o=j;n=sn(b.b,i,a.b,f)}}k=new si(o,n.length,n);Sh(k);return k}
function Yn(a){Un();var b,c,d,e;if(a==null){throw new kl('null string')}b=Cl(a);if(b.length<27||b.length>45){throw new Sk(Hs)}for(d=0;d<Sn.length&&b[d]==Sn[d];++d){}if(d<Sn.length){throw new Sk(Hs)}c=tk(b[d],10);if(c==-1){throw new Sk(Hs)}this.b=this.b*10+c;++d;do{c=tk(b[d],10);if(c==-1){if(b[d]==32){++d;break}throw new Sk(Hs)}this.b=this.b*10+c;if(this.b<0){throw new Sk(Hs)}++d}while(true);for(e=0;e<Tn.length&&b[d]==Tn[e];++d,++e){}if(e<Tn.length){throw new Sk(Hs)}this.c=Vo(Ll(b,d,b.length-d))}
function Em(){Em=rr;Cm=mc(Od,{6:1},-1,[-2147483648,1162261467,1073741824,1220703125,362797056,1977326743,1073741824,387420489,1000000000,214358881,429981696,815730721,1475789056,170859375,268435456,410338673,612220032,893871739,1280000000,1801088541,113379904,148035889,191102976,244140625,308915776,387420489,481890304,594823321,729000000,887503681,1073741824,1291467969,1544804416,1838265625,60466176]);Dm=mc(Od,{6:1},-1,[-1,-1,31,19,15,13,11,11,10,9,9,8,8,8,8,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5])}
function uf(a,b,c){var d,e,f,g,i;d=a.f-b.f;if(b.b==0&&b.g!=-1||a.b==0&&a.g!=-1||c.b==0){return Qf(tf(a,b),c)}if((a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)<d-1){e=b;g=a}else if((b.e>0?b.e:el((b.b-1)*0.3010299956639812)+1)<-d-1){e=a;g=b}else{return Qf(tf(a,b),c)}if(c.b>=(e.e>0?e.e:el((e.b-1)*0.3010299956639812)+1)){return Qf(tf(a,b),c)}f=e.r();if(f==g.r()){i=fn(lo((!e.d&&(e.d=Li(e.g)),e.d),10),Ki(ue(f)))}else{i=rn((!e.d&&(e.d=Li(e.g)),e.d),Ki(ue(f)));i=fn(lo(i,10),Ki(ue(f*9)))}e=new og(i,e.f+1);return Qf(e,c)}
function $f(a){var b,c,d,e,f,g,i,j;g=Hm((!a.d&&(a.d=Li(a.g)),a.d),0);if(a.f==0){return g}b=(!a.d&&(a.d=Li(a.g)),a.d).r()<0?2:1;d=g.length;e=-a.f+d-b;j=new hm(g);if(a.f>0&&e>=-6){if(e>=0){em(j,d-Bc(a.f),ds)}else{ec(j.b,b-1,b-1,es);em(j,b+1,Ll(ef,0,-Bc(e)-1))}}else{c=d-b;i=Bc(e%3);if(i!=0){if((!a.d&&(a.d=Li(a.g)),a.d).r()==0){i=i<0?-i:3-i;e+=i}else{i=i<0?i+3:i;e-=i;b+=i}if(c<3){for(f=i-c;f>0;--f){em(j,d++,Tr)}}}if(d-b>=1){ec(j.b,b,b,ds);++d}if(e!=0){ec(j.b,d,d,fs);e>0&&em(j,++d,gs);em(j,++d,Lr+Ke(te(e)))}}return j.b.b}
function nm(a,b,c,d,e){var f,g,i,j,k,n,o,q,r;if(a==null||c==null){throw new jl}q=a.gC();j=c.gC();if((q.c&4)==0||(j.c&4)==0){throw new rk('Must be array types')}o=q.b;g=j.b;if(!((o.c&1)!=0?o==g:(g.c&1)==0)){throw new rk('Array types must match')}r=a.length;k=c.length;if(b<0||d<0||e<0||b+e>r||d+e>k){throw new Vk}if(((o.c&1)==0||(o.c&4)!=0)&&q!=j){n=vc(a,11);f=vc(c,11);if(Ac(a)===Ac(c)&&b<d){b+=e;for(i=d+e;i-->d;){nc(f,i,n[--b])}}else{for(i=d+e;d<i;){nc(f,d++,n[b++])}}}else{Array.prototype.splice.apply(c,[d,e].concat(a.slice(b,b+e)))}}
function xo(a){uo();var b,c,d,e,f,g,i;f=lc(Od,{6:1},-1,to.length,1);d=lc(Zd,{6:1},-1,1024,2);if(a.e==1&&a.b[0]>=0&&a.b[0]<to[to.length-1]){for(c=0;a.b[0]>=to[c];++c){}return so[c]}i=new si(1,a.e,lc(Od,{6:1},-1,a.e+1,1));nm(a.b,0,i.b,0,a.e);mi(a,0)?nn(i,2):(i.b[0]|=1);e=i.ab();for(b=2;e<ro[b];++b){}for(c=0;c<to.length;++c){f[c]=bn(i,to[c])-1024}while(true){Cq(d,d.length);for(c=0;c<to.length;++c){f[c]=(f[c]+1024)%to[c];e=f[c]==0?0:to[c]-f[c];for(;e<1024;e+=to[c]){d[e]=true}}for(e=0;e<1024;++e){if(!d[e]){g=Rh(i);nn(g,e);if(wo(g,b)){return g}}}nn(i,1024)}}
function Qo(){Qo=rr;Ho=new Ro('UP',0);Bo=new Ro('DOWN',1);Ao=new Ro('CEILING',2);Co=new Ro('FLOOR',3);Fo=new Ro('HALF_UP',4);Do=new Ro('HALF_DOWN',5);Eo=new Ro('HALF_EVEN',6);Go=new Ro('UNNECESSARY',7);zo=mc(Yd,{6:1},19,[Ho,Bo,Ao,Co,Fo,Do,Eo,Go]);Io=mc(Md,{6:1},-1,[67,69,73,76,73,78,71]);Jo=mc(Md,{6:1},-1,[68,79,87,78]);Ko=mc(Md,{6:1},-1,[70,76,79,79,82]);Lo=mc(Md,{6:1},-1,[72,65,76,70,95,68,79,87,78]);Mo=mc(Md,{6:1},-1,[72,65,76,70,95,69,86,69,78]);No=mc(Md,{6:1},-1,[72,65,76,70,95,85,80]);Oo=mc(Md,{6:1},-1,[85,78,78,69,67,69,83,83,65,82,89]);Po=mc(Md,{6:1},-1,[85,80])}
function wf(a,b){var c,d,e,f,g,i,j,k,n,o;k=(!a.d&&(a.d=Li(a.g)),a.d);n=(!b.d&&(b.d=Li(b.g)),b.d);c=a.f-b.f;g=0;e=1;i=kf.length-1;if(b.b==0&&b.g!=-1){throw new nk(_r)}if(k.r()==0){return Ig(c)}d=Yh(k,n);k=Th(k,d);n=Th(n,d);f=n.bb();n=n.fb(f);do{o=Uh(n,kf[e]);if(o[1].r()==0){g+=e;e<i&&++e;n=o[0]}else{if(e==1){break}e=1}}while(true);if(!n._().eQ((Oh(),Jh))){throw new nk('Non-terminating decimal expansion; no exact representable decimal result')}n.r()<0&&(k=k.cb());j=Dg(c+(f>g?f:g));e=f-g;k=e>0?(go(),e<eo.length?lo(k,eo[e]):e<bo.length?ei(k,bo[e]):ei(k,bo[1].db(e))):k.eb(-e);return new dg(k,j)}
function ee(a,b,c){var d,e,f,g,i,j;if(b.l==0&&b.m==0&&b.h==0){throw new nk('divide by zero')}if(a.l==0&&a.m==0&&a.h==0){c&&(ae=de(0,0,0));return de(0,0,0)}if(b.h==524288&&b.m==0&&b.l==0){return fe(a,c)}j=false;if(~~b.h>>19!=0){b=Be(b);j=true}g=le(b);f=false;e=false;d=false;if(a.h==524288&&a.m==0&&a.l==0){e=true;f=true;if(g==-1){a=ce((Qe(),Me));d=true;j=!j}else{i=Fe(a,g);j&&je(i);c&&(ae=de(0,0,0));return i}}else if(~~a.h>>19!=0){f=true;a=Be(a);d=true;j=!j}if(g!=-1){return ge(a,g,j,f,c)}if(!we(a,b)){c&&(f?(ae=Be(a)):(ae=de(a.l,a.m,a.h)));return de(0,0,0)}return he(d?a:de(a.l,a.m,a.h),b,j,f,e,c)}
function An(a,b){var c,d,e,f,g,i,j,k;e=Zh(a);f=Zh(b);if(e>=b.e){return a}j=gl(a.e,b.e);d=e;if(f>e){i=lc(Od,{6:1},-1,j,1);g=hl(a.e,f);for(;d<g;++d){i[d]=a.b[d]}if(d==a.e){for(d=f;d<b.e;++d){i[d]=b.b[d]}}}else{c=-a.b[e]&~b.b[e];if(c==0){g=hl(b.e,a.e);for(++d;d<g&&(c=~(a.b[d]|b.b[d]))==0;++d){}if(c==0){for(;d<b.e&&(c=~b.b[d])==0;++d){}for(;d<a.e&&(c=~a.b[d])==0;++d){}if(c==0){++j;i=lc(Od,{6:1},-1,j,1);i[j-1]=1;k=new si(-1,j,i);return k}}}i=lc(Od,{6:1},-1,j,1);i[d]=-c;++d}g=hl(b.e,a.e);for(;d<g;++d){i[d]=a.b[d]|b.b[d]}for(;d<a.e;++d){i[d]=a.b[d]}for(;d<b.e;++d){i[d]=b.b[d]}k=new si(-1,j,i);return k}
function Lj(a){var b=[];for(var c in a){var d=typeof a[c];d!=ws?(b[b.length]=d):a[c] instanceof Array?(b[b.length]=js):$wnd&&$wnd.bigdecimal&&$wnd.bigdecimal.BigInteger&&a[c] instanceof $wnd.bigdecimal.BigInteger?(b[b.length]=is):$wnd&&$wnd.bigdecimal&&$wnd.bigdecimal.BigDecimal&&a[c] instanceof $wnd.bigdecimal.BigDecimal?(b[b.length]=ps):$wnd&&$wnd.bigdecimal&&$wnd.bigdecimal.RoundingMode&&a[c] instanceof $wnd.bigdecimal.RoundingMode?(b[b.length]=xs):$wnd&&$wnd.bigdecimal&&$wnd.bigdecimal.MathContext&&a[c] instanceof $wnd.bigdecimal.MathContext?(b[b.length]=os):(b[b.length]=ws)}return b.join(ys)}
function Ae(a,b){var c,d,e,f,g,i,j,k,n,o,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G;c=a.l&8191;d=~~a.l>>13|(a.m&15)<<9;e=~~a.m>>4&8191;f=~~a.m>>17|(a.h&255)<<5;g=~~(a.h&1048320)>>8;i=b.l&8191;j=~~b.l>>13|(b.m&15)<<9;k=~~b.m>>4&8191;n=~~b.m>>17|(b.h&255)<<5;o=~~(b.h&1048320)>>8;C=c*i;D=d*i;E=e*i;F=f*i;G=g*i;if(j!=0){D+=c*j;E+=d*j;F+=e*j;G+=f*j}if(k!=0){E+=c*k;F+=d*k;G+=e*k}if(n!=0){F+=c*n;G+=d*n}o!=0&&(G+=c*o);r=C&4194303;s=(D&511)<<13;q=r+s;u=~~C>>22;v=~~D>>9;w=(E&262143)<<4;x=(F&31)<<17;t=u+v+w+x;z=~~E>>18;A=~~F>>5;B=(G&4095)<<8;y=z+A+B;t+=~~q>>22;q&=4194303;y+=~~t>>22;t&=4194303;y&=1048575;return de(q,t,y)}
function zf(a,b,c){var d,e,f,g,i,j,k,n;n=Ie(pe(ue(c.b),vr))+(b.e>0?b.e:el((b.b-1)*0.3010299956639812)+1)-(a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1);e=a.f-b.f;j=e;f=1;i=nf.length-1;k=mc(Xd,{6:1},17,[(!a.d&&(a.d=Li(a.g)),a.d)]);if(c.b==0||a.b==0&&a.g!=-1||b.b==0&&b.g!=-1){return wf(a,b)}if(n>0){nc(k,0,ei((!a.d&&(a.d=Li(a.g)),a.d),po(n)));j+=n}k=Uh(k[0],(!b.d&&(b.d=Li(b.g)),b.d));g=k[0];if(k[1].r()!=0){d=Qh(ki(k[1]),(!b.d&&(b.d=Li(b.g)),b.d));g=fn(ei(g,(Oh(),Lh)),Ki(ue(k[0].r()*(5+d))));++j}else{while(!g.gb(0)){k=Uh(g,nf[f]);if(k[1].r()==0&&j-f>=e){j-=f;f<i&&++f;g=k[0]}else{if(f==1){break}f=1}}}return new eg(g,Dg(j),c)}
function Wm(a,b){var c,d,e,f,g,i,j,k,n,o,q;if(a.f==0){throw new nk(vs)}if(!b.gb(0)){return Vm(a,b)}f=b.e*32;o=Rh(b);q=Rh(a);g=gl(q.e,o.e);j=new si(1,1,lc(Od,{6:1},-1,g+1,1));k=new si(1,1,lc(Od,{6:1},-1,g+1,1));k.b[0]=1;c=0;d=o.bb();e=q.bb();if(d>e){vm(o,d);vm(q,e);um(j,e);c+=d-e}else{vm(o,d);vm(q,e);um(k,d);c+=e-d}j.f=1;while(q.r()>0){while(Qh(o,q)>0){pn(o,q);n=o.bb();vm(o,n);mn(j,k);um(k,n);c+=n}while(Qh(o,q)<=0){pn(q,o);if(q.r()==0){break}n=q.bb();vm(q,n);mn(k,j);um(j,n);c+=n}}if(!(o.e==1&&o.b[0]==1)){throw new nk(vs)}Qh(j,b)>=0&&pn(j,b);j=rn(b,j);i=Jm(b);if(c>f){j=Ym(j,(Oh(),Jh),b,i);c=c-f}j=Ym(j,Ai(f-c),b,i);return j}
function Xf(a,b){var c;c=a.f-b.f;if(a.b==0&&a.g!=-1){if(c<=0){return Mf(b)}if(b.b==0&&b.g!=-1){return a}}else if(b.b==0&&b.g!=-1){if(c>=0){return a}}if(c==0){if(gl(a.b,b.b)+1<54){return new pg(a.g-b.g,a.f)}return new og(rn((!a.d&&(a.d=Li(a.g)),a.d),(!b.d&&(b.d=Li(b.g)),b.d)),a.f)}else if(c>0){if(c<hf.length&&gl(a.b,b.b+jf[Bc(c)])+1<54){return new pg(a.g-b.g*hf[Bc(c)],a.f)}return new og(rn((!a.d&&(a.d=Li(a.g)),a.d),mo((!b.d&&(b.d=Li(b.g)),b.d),Bc(c))),a.f)}else{c=-c;if(c<hf.length&&gl(a.b+jf[Bc(c)],b.b)+1<54){return new pg(a.g*hf[Bc(c)]-b.g,b.f)}return new og(rn(mo((!a.d&&(a.d=Li(a.g)),a.d),Bc(c)),(!b.d&&(b.d=Li(b.g)),b.d)),b.f)}}
function Df(a,b){var c,d,e,f,g,i,j;mc(Xd,{6:1},17,[(!a.d&&(a.d=Li(a.g)),a.d)]);f=a.f-b.f;j=0;c=1;e=nf.length-1;if(b.b==0&&b.g!=-1){throw new nk(_r)}if((b.e>0?b.e:el((b.b-1)*0.3010299956639812)+1)+f>(a.e>0?a.e:el((a.b-1)*0.3010299956639812)+1)+1||a.b==0&&a.g!=-1){d=(Oh(),Nh)}else if(f==0){d=Th((!a.d&&(a.d=Li(a.g)),a.d),(!b.d&&(b.d=Li(b.g)),b.d))}else if(f>0){g=po(f);d=Th((!a.d&&(a.d=Li(a.g)),a.d),ei((!b.d&&(b.d=Li(b.g)),b.d),g));d=ei(d,g)}else{g=po(-f);d=Th(ei((!a.d&&(a.d=Li(a.g)),a.d),g),(!b.d&&(b.d=Li(b.g)),b.d));while(!d.gb(0)){i=Uh(d,nf[c]);if(i[1].r()==0&&j-c>=f){j-=c;c<e&&++c;d=i[0]}else{if(c==1){break}c=1}}f=j}return d.r()==0?Ig(f):new dg(d,Dg(f))}
function Fm(a,b){Em();var c,d,e,f,g,i,j,k,n,o,q,r,s,t,u,v,w,x;u=a.f;o=a.e;i=a.b;if(u==0){return Tr}if(o==1){j=i[0];x=qe(ue(j),yr);u<0&&(x=Be(x));return cl(x,b)}if(b==10||b<2||b>36){return Hm(a,0)}d=Math.log(b)/Math.log(2);s=Bc(sm(new Pi(a.f<0?new si(1,a.e,a.b):a))/d+(u<0?1:0))+1;t=lc(Md,{6:1},-1,s,1);f=s;if(b!=16){v=lc(Od,{6:1},-1,o,1);nm(i,0,v,0,o);w=o;e=Dm[b];c=Cm[b-2];while(true){r=Mm(v,v,w,c);q=f;do{t[--f]=uk(r%b,b)}while((r=~~(r/b))!=0&&f!=0);g=e-q+f;for(k=0;k<g&&f>0;++k){t[--f]=48}for(k=w-1;k>0&&v[k]==0;--k){}w=k+1;if(w==1&&v[0]==0){break}}}else{for(k=0;k<o;++k){for(n=0;n<8&&f>0;++n){r=~~i[k]>>(n<<2)&15;t[--f]=uk(r,16)}}}while(t[f]==48){++f}u==-1&&(t[--f]=45);return Ll(t,f,s-f)}
function Km(a,b,c,d,e,f){var g,i,j,k,n,o,q,r,s,t,u,v,w,x,y,z,A;u=lc(Od,{6:1},-1,d+1,1);v=lc(Od,{6:1},-1,f+1,1);j=$k(e[f-1]);if(j!=0){xm(v,e,0,j);xm(u,c,0,j)}else{nm(c,0,u,0,d);nm(e,0,v,0,f)}k=v[f-1];o=b-1;q=d;while(o>=0){if(u[q]==k){n=-1}else{w=pe(Ee(qe(ue(u[q]),yr),32),qe(ue(u[q-1]),yr));z=Nm(w,k);n=Je(z);y=Je(Fe(z,32));if(n!=0){x=false;++n;do{--n;if(x){break}s=Ae(qe(ue(n),yr),qe(ue(v[f-2]),yr));A=pe(Ee(ue(y),32),qe(ue(u[q-2]),yr));t=pe(qe(ue(y),yr),qe(ue(k),yr));$k(Je(Ge(t,32)))<32?(x=true):(y=Je(t))}while(ve(Le(s,Gr),Le(A,Gr)))}}if(n!=0){g=$m(u,q-f,v,f,n);if(g!=0){--n;i=ur;for(r=0;r<f;++r){i=pe(i,pe(qe(ue(u[q-f+r]),yr),qe(ue(v[r]),yr)));u[q-f+r]=Je(i);i=Ge(i,32)}}}a!=null&&(a[o]=n);--q;--o}if(j!=0){Am(v,f,u,0,j);return v}nm(u,0,v,0,f);return u}
function Vm(a,b){var c,d,e,f,g,i,j,k,n,o,q;f=gl(a.e,b.e);n=lc(Od,{6:1},-1,f+1,1);q=lc(Od,{6:1},-1,f+1,1);nm(b.b,0,n,0,b.e);nm(a.b,0,q,0,a.e);k=new si(b.f,b.e,n);o=new si(a.f,a.e,q);i=new si(0,1,lc(Od,{6:1},-1,f+1,1));j=new si(1,1,lc(Od,{6:1},-1,f+1,1));j.b[0]=1;c=0;d=0;g=b.ab();while(!Um(k,c)&&!Um(o,d)){e=Sm(k,g);if(e!=0){um(k,e);if(c>=d){um(i,e)}else{vm(j,d-c<e?d-c:e);e-(d-c)>0&&um(i,e-d+c)}c+=e}e=Sm(o,g);if(e!=0){um(o,e);if(d>=c){um(j,e)}else{vm(i,c-d<e?c-d:e);e-(c-d)>0&&um(j,e-c+d)}d+=e}if(k.r()==o.r()){if(c<=d){ln(k,o);ln(i,j)}else{ln(o,k);ln(j,i)}}else{if(c<=d){kn(k,o);kn(i,j)}else{kn(o,k);kn(j,i)}}if(o.r()==0||k.r()==0){throw new nk(vs)}}if(Um(o,d)){i=j;o.r()!=k.r()&&(k=k.cb())}k.gb(g)&&(i.r()<0?(i=i.cb()):(i=rn(b,i)));i.r()<0&&(i=fn(i,b));return i}
function We(){var c=navigator.userAgent.toLowerCase();var d=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return c.indexOf(Wr)!=-1}())return Wr;if(function(){return c.indexOf('webkit')!=-1||function(){if(c.indexOf('chromeframe')!=-1){return true}if(typeof window['ActiveXObject']!=Xr){try{var b=new ActiveXObject('ChromeTab.ChromeFrame');if(b){b.registerBhoIfNeeded();return true}}catch(a){}}return false}()}())return Sr;if(function(){return c.indexOf(Yr)!=-1&&$doc.documentMode>=9}())return 'ie9';if(function(){return c.indexOf(Yr)!=-1&&$doc.documentMode>=8}())return 'ie8';if(function(){var a=/msie ([0-9]+)\.([0-9]+)/.exec(c);if(a&&a.length==3)return d(a)>=6000}())return 'ie6';if(function(){return c.indexOf('gecko')!=-1}())return 'gecko1_8';return 'unknown'}
function Kn(a,b){var c,d,e,f,g,i,j,k;j=gl(b.e,a.e);e=Zh(b);f=Zh(a);if(e<f){i=lc(Od,{6:1},-1,j,1);d=e;i[e]=b.b[e];g=hl(b.e,f);for(++d;d<g;++d){i[d]=b.b[d]}if(d==b.e){for(;d<a.e;++d){i[d]=a.b[d]}}}else if(f<e){i=lc(Od,{6:1},-1,j,1);d=f;i[f]=-a.b[f];g=hl(a.e,e);for(++d;d<g;++d){i[d]=~a.b[d]}if(d==e){i[d]=~(a.b[d]^-b.b[d]);++d}else{for(;d<e;++d){i[d]=-1}for(;d<b.e;++d){i[d]=b.b[d]}}}else{d=e;c=a.b[e]^-b.b[e];if(c==0){g=hl(a.e,b.e);for(++d;d<g&&(c=a.b[d]^~b.b[d])==0;++d){}if(c==0){for(;d<a.e&&(c=~a.b[d])==0;++d){}for(;d<b.e&&(c=~b.b[d])==0;++d){}if(c==0){j=j+1;i=lc(Od,{6:1},-1,j,1);i[j-1]=1;k=new si(-1,j,i);return k}}}i=lc(Od,{6:1},-1,j,1);i[d]=-c;++d}g=hl(b.e,a.e);for(;d<g;++d){i[d]=~(~b.b[d]^a.b[d])}for(;d<a.e;++d){i[d]=a.b[d]}for(;d<b.e;++d){i[d]=b.b[d]}k=new si(-1,j,i);Sh(k);return k}
function rf(){rf=rr;var a,b;lf=new qg(sr,0);mf=new qg(tr,0);of=new qg(ur,0);df=lc(Wd,{6:1},16,11,0);ef=lc(Md,{6:1},-1,100,1);ff=mc(Nd,{6:1},-1,[1,5,25,125,625,3125,15625,78125,390625,1953125,9765625,48828125,244140625,1220703125,6103515625,30517578125,152587890625,762939453125,3814697265625,19073486328125,95367431640625,476837158203125,2384185791015625]);gf=lc(Od,{6:1},-1,ff.length,1);hf=mc(Nd,{6:1},-1,[1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000,100000000000,1000000000000,10000000000000,100000000000000,1000000000000000,10000000000000000]);jf=lc(Od,{6:1},-1,hf.length,1);pf=lc(Wd,{6:1},16,11,0);a=0;for(;a<pf.length;++a){nc(df,a,new qg(ue(a),0));nc(pf,a,new qg(ur,a));ef[a]=48}for(;a<ef.length;++a){ef[a]=48}for(b=0;b<gf.length;++b){gf[b]=sg(ff[b])}for(b=0;b<jf.length;++b){jf[b]=sg(hf[b])}nf=(go(),co);kf=bo}
function Hf(a,b){var c,d,e,f,g,i,j,k,n,o;c=0;i=0;g=b.length;n=new gm(b.length);if(0<g&&b.charCodeAt(0)==43){++i;++c;if(i<g&&(b.charCodeAt(i)==43||b.charCodeAt(i)==45)){throw new pl(Zr+b+$r)}}e=0;o=false;for(;i<g&&b.charCodeAt(i)!=46&&b.charCodeAt(i)!=101&&b.charCodeAt(i)!=69;++i){o||(b.charCodeAt(i)==48?++e:(o=true))}am(n,b,c,i);if(i<g&&b.charCodeAt(i)==46){++i;c=i;for(;i<g&&b.charCodeAt(i)!=101&&b.charCodeAt(i)!=69;++i){o||(b.charCodeAt(i)==48?++e:(o=true))}a.f=i-c;am(n,b,c,i)}else{a.f=0}if(i<g&&(b.charCodeAt(i)==101||b.charCodeAt(i)==69)){++i;c=i;if(i<g&&b.charCodeAt(i)==43){++i;i<g&&b.charCodeAt(i)!=45&&++c}j=b.substr(c,g-c);a.f=a.f-af(j,10);if(a.f!=Bc(a.f)){throw new pl('Scale out of range.')}}k=n.b.b;if(k.length<16){a.g=zg(k);if(Hk(a.g)){throw new pl(Zr+b+$r)}a.b=sg(a.g)}else{Tf(a,new oi(k))}a.e=n.b.b.length-e;for(f=0;f<n.b.b.length;++f){d=vl(n.b.b,f);if(d!=45&&d!=48){break}--a.e}}
function Im(a,b){Em();var c,d,e,f,g,i,j,k,n,o;g=xe(a,ur);g&&(a=Be(a));if(se(a,ur)){switch(b){case 0:return Tr;case 1:return zs;case 2:return As;case 3:return Bs;case 4:return Cs;case 5:return Ds;case 6:return Es;default:k=new fm;b<0?(k.b.b+=Fs,k):(k.b.b+=Gs,k);cc(k.b,b==-2147483648?'2147483648':Lr+-b);return k.b.b;}}j=lc(Md,{6:1},-1,19,1);c=18;o=a;do{i=o;o=re(o,tr);j[--c]=Je(pe(Cr,He(i,Ae(o,tr))))&65535}while(Ce(o,ur));d=He(He(He(Dr,ue(c)),ue(b)),sr);if(b==0){g&&(j[--c]=45);return Ll(j,c,18-c)}if(b>0&&we(d,Er)){if(we(d,ur)){e=c+Je(d);for(f=17;f>=e;--f){j[f+1]=j[f]}j[++e]=46;g&&(j[--c]=45);return Ll(j,c,18-c+1)}for(f=2;xe(ue(f),pe(Be(d),sr));++f){j[--c]=48}j[--c]=46;j[--c]=48;g&&(j[--c]=45);return Ll(j,c,18-c)}n=c+1;k=new gm;g&&(k.b.b+=Ur,k);if(18-n>=1){Zl(k,j[c]);k.b.b+=ds;dc(k.b,Ll(j,c+1,18-c-1))}else{dc(k.b,Ll(j,c,18-c))}k.b.b+=fs;ve(d,ur)&&(k.b.b+=gs,k);cc(k.b,Lr+Ke(d));return k.b.b}
function Ef(a,b,c){var d,e,f,g,i,j,k,n,o,q,r,s,t;n=c.b;e=Pf(a)-b.q();k=nf.length-1;f=a.f-b.f;o=f;r=e-f+1;q=lc(Xd,{6:1},17,2,0);if(n==0||a.b==0&&a.g!=-1||b.b==0&&b.g!=-1){return Df(a,b)}if(r<=0){nc(q,0,(Oh(),Nh))}else if(f==0){nc(q,0,Th((!a.d&&(a.d=Li(a.g)),a.d),(!b.d&&(b.d=Li(b.g)),b.d)))}else if(f>0){nc(q,0,Th((!a.d&&(a.d=Li(a.g)),a.d),ei((!b.d&&(b.d=Li(b.g)),b.d),po(f))));o=f<(n-r+1>0?n-r+1:0)?f:n-r+1>0?n-r+1:0;nc(q,0,ei(q[0],po(o)))}else{g=-f<(n-e>0?n-e:0)?-f:n-e>0?n-e:0;q=Uh(ei((!a.d&&(a.d=Li(a.g)),a.d),po(g)),(!b.d&&(b.d=Li(b.g)),b.d));o+=g;g=-o;if(q[1].r()!=0&&g>0){d=(new cg(q[1])).q()+g-b.q();if(d==0){nc(q,1,Th(ei(q[1],po(g)),(!b.d&&(b.d=Li(b.g)),b.d)));d=dl(q[1].r())}if(d>0){throw new nk(as)}}}if(q[0].r()==0){return Ig(f)}t=q[0];j=new cg(q[0]);s=j.q();i=1;while(!t.gb(0)){q=Uh(t,nf[i]);if(q[1].r()==0&&(s-i>=n||o-i>=f)){s-=i;o-=i;i<k&&++i;t=q[0]}else{if(i==1){break}i=1}}if(s>n){throw new nk(as)}j.f=Dg(o);Tf(j,t);return j}
function Ve(){var a,b,c;b=$doc.compatMode;a=mc(Vd,{6:1},1,[Vr]);for(c=0;c<a.length;++c){if(wl(a[c],b)){return}}a.length==1&&wl(Vr,a[0])&&wl('BackCompat',b)?"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\"document.compatMode\" value=\""+b+'"/&gt;':"Your *.gwt.xml module configuration prohibits the use of the current doucment rendering mode (document.compatMode=' "+b+"').<br>Modify your application's host HTML page doctype, or update your custom 'document.compatMode' configuration property settings."}
function Lg(a){rf();var b,c;c=Lj(a);if(c==is)b=new cg(new oi(a[0].toString()));else if(c=='BigInteger number')b=new dg(new oi(a[0].toString()),a[1]);else if(c=='BigInteger number MathContext')b=new eg(new oi(a[0].toString()),a[1],new Yn(a[2].toString()));else if(c=='BigInteger MathContext')b=new fg(new oi(a[0].toString()),new Yn(a[1].toString()));else if(c==js)b=new gg(Cl(a[0].toString()));else if(c=='array number number')b=new hg(Cl(a[0].toString()),a[1],a[2]);else if(c=='array number number MathContext')b=new ig(Cl(a[0].toString()),a[1],a[2],new Yn(a[3].toString()));else if(c=='array MathContext')b=new jg(Cl(a[0].toString()),new Yn(a[1].toString()));else if(c==ks)b=new kg(a[0]);else if(c==ls)b=new lg(a[0],new Yn(a[1].toString()));else if(c==ms)b=new mg(a[0].toString());else if(c=='string MathContext')b=new ng(a[0].toString(),new Yn(a[1].toString()));else throw new V('Unknown call signature for obj = new java.math.BigDecimal: '+c);return new Kg(b)}
function uo(){uo=rr;var a;ro=mc(Od,{6:1},-1,[0,0,1854,1233,927,747,627,543,480,431,393,361,335,314,295,279,265,253,242,232,223,216,181,169,158,150,145,140,136,132,127,123,119,114,110,105,101,96,92,87,83,78,73,69,64,59,54,49,44,38,32,26,1]);to=mc(Od,{6:1},-1,[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021]);so=lc(Xd,{6:1},17,to.length,0);for(a=0;a<to.length;++a){nc(so,a,Ki(ue(to[a])))}}
function Xj(){nr(rs,Lr);if($wnd.bigdecimal.MathContext){var b=$wnd.bigdecimal.MathContext}$wnd.bigdecimal.MathContext=Jr(function(){if(arguments.length==1&&arguments[0]!=null&&arguments[0].gC()==Uc){this.__gwt_instance=arguments[0]}else if(arguments.length==0){this.__gwt_instance=new Nj;or(this.__gwt_instance,this)}else if(arguments.length==1){this.__gwt_instance=Zj(arguments[0]);or(this.__gwt_instance,this)}});var c=$wnd.bigdecimal.MathContext.prototype=new Object;if(b){for(p in b){$wnd.bigdecimal.MathContext[p]=b[p]}}c.getPrecision=jr(Number,Jr(function(){var a=this.__gwt_instance.Hb();return a}));c.getRoundingMode=Jr(function(){var a=this.__gwt_instance.Ib();return pr(a)});c.hashCode=jr(Number,Jr(function(){var a=this.__gwt_instance.hC();return a}));c.toString=Jr(function(){var a=this.__gwt_instance.tS();return a});$wnd.bigdecimal.MathContext.DECIMAL128=Jr(function(){var a=new Oj(Wn((Un(),On)));return pr(a)});$wnd.bigdecimal.MathContext.DECIMAL32=Jr(function(){var a=new Oj(Wn((Un(),Pn)));return pr(a)});$wnd.bigdecimal.MathContext.DECIMAL64=Jr(function(){var a=new Oj(Wn((Un(),Qn)));return pr(a)});$wnd.bigdecimal.MathContext.UNLIMITED=Jr(function(){var a=new Oj(Wn((Un(),Rn)));return pr(a)});mr(Uc,$wnd.bigdecimal.MathContext)}
function Hm(a,b){Em();var c,d,e,f,g,i,j,k,n,o,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;z=a.f;q=a.e;e=a.b;if(z==0){switch(b){case 0:return Tr;case 1:return zs;case 2:return As;case 3:return Bs;case 4:return Cs;case 5:return Ds;case 6:return Es;default:x=new fm;b<0?(x.b.b+=Fs,x):(x.b.b+=Gs,x);ac(x.b,-b);return x.b.b;}}v=q*10+1+7;w=lc(Md,{6:1},-1,v+1,1);c=v;if(q==1){g=e[0];if(g<0){E=qe(ue(g),yr);do{r=E;E=re(E,tr);w[--c]=48+Je(He(r,Ae(E,tr)))&65535}while(Ce(E,ur))}else{E=g;do{r=E;E=~~(E/10);w[--c]=48+(r-E*10)&65535}while(E!=0)}}else{B=lc(Od,{6:1},-1,q,1);D=q;nm(e,0,B,0,q);F:while(true){y=ur;for(j=D-1;j>=0;--j){C=pe(Ee(y,32),qe(ue(B[j]),yr));t=Gm(C);B[j]=Je(t);y=ue(Je(Fe(t,32)))}u=Je(y);s=c;do{w[--c]=48+u%10&65535}while((u=~~(u/10))!=0&&c!=0);d=9-s+c;for(i=0;i<d&&c>0;++i){w[--c]=48}n=D-1;for(;B[n]==0;--n){if(n==0){break F}}D=n+1}while(w[c]==48){++c}}o=z<0;f=v-c-b-1;if(b==0){o&&(w[--c]=45);return Ll(w,c,v-c)}if(b>0&&f>=-6){if(f>=0){k=c+f;for(n=v-1;n>=k;--n){w[n+1]=w[n]}w[++k]=46;o&&(w[--c]=45);return Ll(w,c,v-c+1)}for(n=2;n<-f+1;++n){w[--c]=48}w[--c]=46;w[--c]=48;o&&(w[--c]=45);return Ll(w,c,v-c)}A=c+1;x=new gm;o&&(x.b.b+=Ur,x);if(v-A>=1){Zl(x,w[c]);x.b.b+=ds;dc(x.b,Ll(w,c+1,v-c-1))}else{dc(x.b,Ll(w,c,v-c))}x.b.b+=fs;f>0&&(x.b.b+=gs,x);cc(x.b,Lr+f);return x.b.b}
function jk(){nr(rs,Lr);if($wnd.bigdecimal.RoundingMode){var c=$wnd.bigdecimal.RoundingMode}$wnd.bigdecimal.RoundingMode=Jr(function(){if(arguments.length==1&&arguments[0]!=null&&arguments[0].gC()==Wc){this.__gwt_instance=arguments[0]}else if(arguments.length==0){this.__gwt_instance=new ak;or(this.__gwt_instance,this)}});var d=$wnd.bigdecimal.RoundingMode.prototype=new Object;if(c){for(p in c){$wnd.bigdecimal.RoundingMode[p]=c[p]}}$wnd.bigdecimal.RoundingMode.valueOf=Jr(function(a){var b=new bk((Qo(),Ok((Yo(),Xo),a)));return pr(b)});$wnd.bigdecimal.RoundingMode.values=Jr(function(){var a=fk();return qr(a)});d.name=Jr(function(){var a=this.__gwt_instance.Jb();return a});d.toString=Jr(function(){var a=this.__gwt_instance.tS();return a});$wnd.bigdecimal.RoundingMode.CEILING=Jr(function(){var a=new bk((Qo(),Ao));return pr(a)});$wnd.bigdecimal.RoundingMode.DOWN=Jr(function(){var a=new bk((Qo(),Bo));return pr(a)});$wnd.bigdecimal.RoundingMode.FLOOR=Jr(function(){var a=new bk((Qo(),Co));return pr(a)});$wnd.bigdecimal.RoundingMode.HALF_DOWN=Jr(function(){var a=new bk((Qo(),Do));return pr(a)});$wnd.bigdecimal.RoundingMode.HALF_EVEN=Jr(function(){var a=new bk((Qo(),Eo));return pr(a)});$wnd.bigdecimal.RoundingMode.HALF_UP=Jr(function(){var a=new bk((Qo(),Fo));return pr(a)});$wnd.bigdecimal.RoundingMode.UNNECESSARY=Jr(function(){var a=new bk((Qo(),Go));return pr(a)});$wnd.bigdecimal.RoundingMode.UP=Jr(function(){var a=new bk((Qo(),Ho));return pr(a)});mr(Wc,$wnd.bigdecimal.RoundingMode)}
function Hj(){nr(rs,Lr);if($wnd.bigdecimal.BigInteger){var d=$wnd.bigdecimal.BigInteger}$wnd.bigdecimal.BigInteger=Jr(function(){if(arguments.length==1&&arguments[0]!=null&&arguments[0].gC()==Sc){this.__gwt_instance=arguments[0]}else if(arguments.length==0){this.__gwt_instance=new Ni;or(this.__gwt_instance,this)}else if(arguments.length==1){this.__gwt_instance=Jj(arguments[0]);or(this.__gwt_instance,this)}});var e=$wnd.bigdecimal.BigInteger.prototype=new Object;if(d){for(p in d){$wnd.bigdecimal.BigInteger[p]=d[p]}}$wnd.bigdecimal.BigInteger.__init__=Jr(function(a){var b=Qi(a);return pr(b)});e.abs=Jr(function(){var a=this.__gwt_instance._();return pr(a)});e.add=Jr(function(a){var b=this.__gwt_instance.hb(a.__gwt_instance);return pr(b)});e.and=Jr(function(a){var b=this.__gwt_instance.ib(a.__gwt_instance);return pr(b)});e.andNot=Jr(function(a){var b=this.__gwt_instance.jb(a.__gwt_instance);return pr(b)});e.bitCount=jr(Number,Jr(function(){var a=this.__gwt_instance.kb();return a}));e.bitLength=jr(Number,Jr(function(){var a=this.__gwt_instance.ab();return a}));e.clearBit=Jr(function(a){var b=this.__gwt_instance.lb(a);return pr(b)});e.compareTo=jr(Number,Jr(function(a){var b=this.__gwt_instance.mb(a.__gwt_instance);return b}));e.divide=Jr(function(a){var b=this.__gwt_instance.nb(a.__gwt_instance);return pr(b)});e.doubleValue=jr(Number,Jr(function(){var a=this.__gwt_instance.z();return a}));e.equals=jr(Number,Jr(function(a){var b=this.__gwt_instance.eQ(a);return b}));e.flipBit=Jr(function(a){var b=this.__gwt_instance.pb(a);return pr(b)});e.floatValue=jr(Number,Jr(function(){var a=this.__gwt_instance.A();return a}));e.gcd=Jr(function(a){var b=this.__gwt_instance.qb(a.__gwt_instance);return pr(b)});e.getLowestSetBit=jr(Number,Jr(function(){var a=this.__gwt_instance.bb();return a}));e.hashCode=jr(Number,Jr(function(){var a=this.__gwt_instance.hC();return a}));e.intValue=jr(Number,Jr(function(){var a=this.__gwt_instance.B();return a}));e.isProbablePrime=jr(Number,Jr(function(a){var b=this.__gwt_instance.rb(a);return b}));e.max=Jr(function(a){var b=this.__gwt_instance.tb(a.__gwt_instance);return pr(b)});e.min=Jr(function(a){var b=this.__gwt_instance.ub(a.__gwt_instance);return pr(b)});e.mod=Jr(function(a){var b=this.__gwt_instance.vb(a.__gwt_instance);return pr(b)});e.modInverse=Jr(function(a){var b=this.__gwt_instance.wb(a.__gwt_instance);return pr(b)});e.modPow=Jr(function(a,b){var c=this.__gwt_instance.xb(a.__gwt_instance,b.__gwt_instance);return pr(c)});e.multiply=Jr(function(a){var b=this.__gwt_instance.yb(a.__gwt_instance);return pr(b)});e.negate=Jr(function(){var a=this.__gwt_instance.cb();return pr(a)});e.nextProbablePrime=Jr(function(){var a=this.__gwt_instance.zb();return pr(a)});e.not=Jr(function(){var a=this.__gwt_instance.Ab();return pr(a)});e.or=Jr(function(a){var b=this.__gwt_instance.Bb(a.__gwt_instance);return pr(b)});e.pow=Jr(function(a){var b=this.__gwt_instance.db(a);return pr(b)});e.remainder=Jr(function(a){var b=this.__gwt_instance.Cb(a.__gwt_instance);return pr(b)});e.setBit=Jr(function(a){var b=this.__gwt_instance.Db(a);return pr(b)});e.shiftLeft=Jr(function(a){var b=this.__gwt_instance.eb(a);return pr(b)});e.shiftRight=Jr(function(a){var b=this.__gwt_instance.fb(a);return pr(b)});e.signum=jr(Number,Jr(function(){var a=this.__gwt_instance.r();return a}));e.subtract=Jr(function(a){var b=this.__gwt_instance.Eb(a.__gwt_instance);return pr(b)});e.testBit=jr(Number,Jr(function(a){var b=this.__gwt_instance.gb(a);return b}));e.toString_va=Jr(function(a){var b=this.__gwt_instance.Fb(a);return b});e.xor=Jr(function(a){var b=this.__gwt_instance.Gb(a.__gwt_instance);return pr(b)});e.divideAndRemainder=Jr(function(a){var b=this.__gwt_instance.ob(a.__gwt_instance);return qr(b)});e.longValue=jr(Number,Jr(function(){var a=this.__gwt_instance.sb();return a}));$wnd.bigdecimal.BigInteger.valueOf=Jr(function(a){var b=(Oh(),new Pi(Ki(te(a))));return pr(b)});$wnd.bigdecimal.BigInteger.ONE=Jr(function(){var a=(Oh(),new Pi(Jh));return pr(a)});$wnd.bigdecimal.BigInteger.TEN=Jr(function(){var a=(Oh(),new Pi(Lh));return pr(a)});$wnd.bigdecimal.BigInteger.ZERO=Jr(function(){var a=(Oh(),new Pi(Nh));return pr(a)});mr(Sc,$wnd.bigdecimal.BigInteger)}
function Dh(){nr(rs,Lr);if($wnd.bigdecimal.BigDecimal){var c=$wnd.bigdecimal.BigDecimal}$wnd.bigdecimal.BigDecimal=Jr(function(){if(arguments.length==1&&arguments[0]!=null&&arguments[0].gC()==Qc){this.__gwt_instance=arguments[0]}else if(arguments.length==0){this.__gwt_instance=new Jg;or(this.__gwt_instance,this)}});var d=$wnd.bigdecimal.BigDecimal.prototype=new Object;if(c){for(p in c){$wnd.bigdecimal.BigDecimal[p]=c[p]}}$wnd.bigdecimal.BigDecimal.ROUND_CEILING=2;$wnd.bigdecimal.BigDecimal.ROUND_DOWN=1;$wnd.bigdecimal.BigDecimal.ROUND_FLOOR=3;$wnd.bigdecimal.BigDecimal.ROUND_HALF_DOWN=5;$wnd.bigdecimal.BigDecimal.ROUND_HALF_EVEN=6;$wnd.bigdecimal.BigDecimal.ROUND_HALF_UP=4;$wnd.bigdecimal.BigDecimal.ROUND_UNNECESSARY=7;$wnd.bigdecimal.BigDecimal.ROUND_UP=0;$wnd.bigdecimal.BigDecimal.__init__=Jr(function(a){var b=Lg(a);return pr(b)});d.abs_va=Jr(function(a){var b=this.__gwt_instance.s(a);return pr(b)});d.add_va=Jr(function(a){var b=this.__gwt_instance.t(a);return pr(b)});d.byteValueExact=jr(Number,Jr(function(){var a=this.__gwt_instance.u();return a}));d.compareTo=jr(Number,Jr(function(a){var b=this.__gwt_instance.v(a.__gwt_instance);return b}));d.divide_va=Jr(function(a){var b=this.__gwt_instance.y(a);return pr(b)});d.divideToIntegralValue_va=Jr(function(a){var b=this.__gwt_instance.x(a);return pr(b)});d.doubleValue=jr(Number,Jr(function(){var a=this.__gwt_instance.z();return a}));d.equals=jr(Number,Jr(function(a){var b=this.__gwt_instance.eQ(a);return b}));d.floatValue=jr(Number,Jr(function(){var a=this.__gwt_instance.A();return a}));d.hashCode=jr(Number,Jr(function(){var a=this.__gwt_instance.hC();return a}));d.intValue=jr(Number,Jr(function(){var a=this.__gwt_instance.B();return a}));d.intValueExact=jr(Number,Jr(function(){var a=this.__gwt_instance.C();return a}));d.max=Jr(function(a){var b=this.__gwt_instance.F(a.__gwt_instance);return pr(b)});d.min=Jr(function(a){var b=this.__gwt_instance.G(a.__gwt_instance);return pr(b)});d.movePointLeft=Jr(function(a){var b=this.__gwt_instance.H(a);return pr(b)});d.movePointRight=Jr(function(a){var b=this.__gwt_instance.I(a);return pr(b)});d.multiply_va=Jr(function(a){var b=this.__gwt_instance.J(a);return pr(b)});d.negate_va=Jr(function(a){var b=this.__gwt_instance.K(a);return pr(b)});d.plus_va=Jr(function(a){var b=this.__gwt_instance.L(a);return pr(b)});d.pow_va=Jr(function(a){var b=this.__gwt_instance.M(a);return pr(b)});d.precision=jr(Number,Jr(function(){var a=this.__gwt_instance.q();return a}));d.remainder_va=Jr(function(a){var b=this.__gwt_instance.N(a);return pr(b)});d.round=Jr(function(a){var b=this.__gwt_instance.O(a.__gwt_instance);return pr(b)});d.scale=jr(Number,Jr(function(){var a=this.__gwt_instance.P();return a}));d.scaleByPowerOfTen=Jr(function(a){var b=this.__gwt_instance.Q(a);return pr(b)});d.setScale_va=Jr(function(a){var b=this.__gwt_instance.R(a);return pr(b)});d.shortValueExact=jr(Number,Jr(function(){var a=this.__gwt_instance.S();return a}));d.signum=jr(Number,Jr(function(){var a=this.__gwt_instance.r();return a}));d.stripTrailingZeros=Jr(function(){var a=this.__gwt_instance.T();return pr(a)});d.subtract_va=Jr(function(a){var b=this.__gwt_instance.U(a);return pr(b)});d.toBigInteger=Jr(function(){var a=this.__gwt_instance.V();return pr(a)});d.toBigIntegerExact=Jr(function(){var a=this.__gwt_instance.W();return pr(a)});d.toEngineeringString=Jr(function(){var a=this.__gwt_instance.X();return a});d.toPlainString=Jr(function(){var a=this.__gwt_instance.Y();return a});d.toString=Jr(function(){var a=this.__gwt_instance.tS();return a});d.ulp=Jr(function(){var a=this.__gwt_instance.Z();return pr(a)});d.unscaledValue=Jr(function(){var a=this.__gwt_instance.$();return pr(a)});d.divideAndRemainder_va=Jr(function(a){var b=this.__gwt_instance.w(a);return qr(b)});d.longValue=jr(Number,Jr(function(){var a=this.__gwt_instance.E();return a}));d.longValueExact=jr(Number,Jr(function(){var a=this.__gwt_instance.D();return a}));$wnd.bigdecimal.BigDecimal.valueOf_va=Jr(function(a){var b=zh(a);return pr(b)});$wnd.bigdecimal.BigDecimal.log=jr(Number,Jr(function(a){rf();typeof console!==Xr&&console.log&&console.log(a)}));$wnd.bigdecimal.BigDecimal.logObj=jr(Number,Jr(function(a){rf();typeof console!==Xr&&console.log&&typeof JSON!==Xr&&JSON.stringify&&console.log('object: '+JSON.stringify(a))}));$wnd.bigdecimal.BigDecimal.ONE=Jr(function(){var a=(rf(),new Kg(lf));return pr(a)});$wnd.bigdecimal.BigDecimal.TEN=Jr(function(){var a=(rf(),new Kg(mf));return pr(a)});$wnd.bigdecimal.BigDecimal.ZERO=Jr(function(){var a=(rf(),new Kg(of));return pr(a)});mr(Qc,$wnd.bigdecimal.BigDecimal)}
var Lr='',ys=' ',$r='"',Or='(',gs='+',Is=', ',Ur='-',ds='.',Tr='0',es='0.',zs='0.0',As='0.00',Bs='0.000',Cs='0.0000',Ds='0.00000',Es='0.000000',Gs='0E',Fs='0E+',Qr=':',Kr=': ',Js='=',ps='BigDecimal',qs='BigDecimal MathContext',Ts='BigDecimal;',is='BigInteger',ss='BigInteger divide by zero',vs='BigInteger not invertible.',us='BigInteger: modulus not positive',Us='BigInteger;',Vr='CSS1Compat',_r='Division by zero',as='Division impossible',fs='E',Zr='For input string: "',hs='Infinite or NaN',bs='Invalid Operation',os='MathContext',ts='Negative bit address',cs='Rounding necessary',xs='RoundingMode',Vs='RoundingMode;',Nr='String',Rr='[',Ss='[Lcom.iriscouch.gwtapp.client.',Os='[Ljava.lang.',Ws='[Ljava.math.',Ks='\\.',Ls='__gwtex_wrap',Pr='anonymous',js='array',Hs='bad string format',rs='bigdecimal',Ns='com.google.gwt.core.client.',Ps='com.google.gwt.core.client.impl.',Rs='com.iriscouch.gwtapp.client.',Ms='java.lang.',Qs='java.math.',Xs='java.util.',Yr='msie',Mr='null',ks='number',ls='number MathContext',ns='number number',ws='object',Wr='opera',Ys='org.timepedia.exporter.client.',Sr='safari',ms='string',Xr='undefined';var _,Gr={l:0,m:0,h:524288},zr={l:0,m:4193280,h:1048575},Er={l:4194298,m:4194303,h:1048575},wr={l:4194303,m:4194303,h:1048575},ur={l:0,m:0,h:0},sr={l:1,m:0,h:0},vr={l:2,m:0,h:0},Hr={l:5,m:0,h:0},tr={l:10,m:0,h:0},xr={l:11,m:0,h:0},Dr={l:18,m:0,h:0},Cr={l:48,m:0,h:0},Br={l:877824,m:119,h:0},Ar={l:1755648,m:238,h:0},Ir={l:4194303,m:511,h:0},yr={l:4194303,m:1023,h:0},Fr={l:0,m:1024,h:0};_=H.prototype={};_.eQ=function I(a){return this===a};_.gC=function J(){return gd};_.hC=function K(){return ob(this)};_.tS=function L(){return this.gC().d+'@'+al(this.hC())};_.toString=function(){return this.tS()};_.tM=rr;_.cM={};_=P.prototype=new H;_.gC=function R(){return nd};_.j=function S(){return this.f};_.tS=function T(){var a,b;a=this.gC().d;b=this.j();return b!=null?a+Kr+b:a};_.cM={6:1,15:1};_.f=null;_=O.prototype=new P;_.gC=function U(){return ad};_.cM={6:1,15:1};_=V.prototype=N.prototype=new O;_.gC=function W(){return hd};_.cM={6:1,12:1,15:1};_=X.prototype=M.prototype=new N;_.gC=function Y(){return Fc};_.j=function ab(){this.d==null&&(this.e=bb(this.c),this.b=Z(this.c),this.d=Or+this.e+'): '+this.b+db(this.c),undefined);return this.d};_.cM={6:1,12:1,15:1};_.b=null;_.c=null;_.d=null;_.e=null;_=gb.prototype=new H;_.gC=function hb(){return Hc};var ib=0,jb=0;_=ub.prototype=pb.prototype=new gb;_.gC=function vb(){return Ic};_.b=null;_.c=null;var qb;_=Fb.prototype=Ab.prototype=new H;_.k=function Gb(){var a={};var b=[];var c=arguments.callee.caller.caller;while(c){var d=this.n(c.toString());b.push(d);var e=Qr+d;var f=a[e];if(f){var g,i;for(g=0,i=f.length;g<i;g++){if(f[g]===c){return b}}}(f||(a[e]=[])).push(c);c=c.caller}return b};_.n=function Hb(a){return yb(a)};_.gC=function Ib(){return Lc};_.o=function Jb(a){return []};_=Lb.prototype=new Ab;_.k=function Nb(){return zb(this.o(Eb()),this.p())};_.gC=function Ob(){return Kc};_.o=function Pb(a){return Mb(this,a)};_.p=function Qb(){return 2};_=Tb.prototype=Kb.prototype=new Lb;_.k=function Ub(){return Rb(this)};_.n=function Vb(a){var b,c;if(a.length==0){return Pr}c=Dl(a);c.indexOf('at ')==0&&(c=Al(c,3));b=c.indexOf(Rr);b==-1&&(b=c.indexOf(Or));if(b==-1){return Pr}else{c=Dl(c.substr(0,b-0))}b=yl(c,String.fromCharCode(46));b!=-1&&(c=Al(c,b+1));return c.length>0?c:Pr};_.gC=function Wb(){return Jc};_.o=function Xb(a){return Sb(this,a)};_.p=function Yb(){return 3};_=Zb.prototype=new H;_.gC=function $b(){return Nc};_=fc.prototype=_b.prototype=new Zb;_.gC=function gc(){return Mc};_.b=Lr;_=ic.prototype=hc.prototype=new H;_.gC=function kc(){return this.aC};_.aC=null;_.qI=0;var oc,pc;var ae=null;var oe=null;var Me,Ne,Oe,Pe;_=Se.prototype=Re.prototype=new H;_.gC=function Te(){return Oc};_.cM={2:1};_=Ze.prototype=new H;_.gC=function cf(){return fd};_.cM={6:1,10:1};var $e=null;_=qg.prototype=pg.prototype=og.prototype=ng.prototype=mg.prototype=lg.prototype=kg.prototype=jg.prototype=ig.prototype=hg.prototype=gg.prototype=fg.prototype=eg.prototype=dg.prototype=cg.prototype=Ye.prototype=new Ze;_.eQ=function wg(a){return Ff(this,a)};_.gC=function xg(){return pd};_.hC=function yg(){return Gf(this)};_.q=function Ag(){return Pf(this)};_.r=function Cg(){return Uf(this)};_.tS=function Eg(){return ag(this)};_.cM={6:1,8:1,10:1,16:1};_.b=0;_.c=0;_.d=null;_.e=0;_.f=0;_.g=0;_.i=null;var df,ef,ff,gf,hf,jf,kf=null,lf,mf,nf=null,of,pf,qf=null;_=Kg.prototype=Jg.prototype=Xe.prototype=new Ye;_.s=function Mg(a){var b,c,d;d=Lj(a);if(d==Lr)b=Uf(this)<0?Mf(this):this;else if(d==os)b=sf(Qf(this,new Yn(a[0].toString())));else throw new V('Unknown call signature for interim = super.abs: '+d);c=new Kg(b);return c};_.t=function Ng(a){var b,c,d;d=Lj(a);if(d==ps)b=tf(this,new mg(a[0].toString()));else if(d==qs)b=uf(this,new mg(a[0].toString()),new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.add: '+d);c=new Kg(b);return c};_.u=function Og(){return ~~(Je(bg(this,8))<<24)>>24};_.v=function Pg(a){return vf(this,a)};_.w=function Qg(a){var b,c,d,e;e=Lj(a);if(e==ps)c=Bf(this,new mg(a[0].toString()));else if(e==qs)c=Cf(this,new mg(a[0].toString()),new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.divideAndRemainder: '+e);d=lc(Qd,{6:1},3,c.length,0);for(b=0;b<c.length;++b)d[b]=new Kg(c[b]);return d};_.x=function Rg(a){var b,c,d;d=Lj(a);if(d==ps)b=Df(this,new mg(a[0].toString()));else if(d==qs)b=Ef(this,new mg(a[0].toString()),new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.divideToIntegralValue: '+d);c=new Kg(b);return c};_.y=function Sg(a){var b,c,d;d=Lj(a);if(d==ps)b=wf(this,new mg(a[0].toString()));else if(d=='BigDecimal number')b=xf(this,new mg(a[0].toString()),a[1]);else if(d=='BigDecimal number number')b=yf(this,new mg(a[0].toString()),a[1],Uo(a[2]));else if(d=='BigDecimal number RoundingMode')b=yf(this,new mg(a[0].toString()),a[1],To(a[2].toString()));else if(d==qs)b=zf(this,new mg(a[0].toString()),new Yn(a[1].toString()));else if(d=='BigDecimal RoundingMode')b=Af(this,new mg(a[0].toString()),To(a[1].toString()));else throw new V('Unknown call signature for interim = super.divide: '+d);c=new Kg(b);return c};_.z=function Tg(){return _e(ag(this))};_.eQ=function Ug(a){return Ff(this,a)};_.A=function Vg(){var a,b;return a=Uf(this),b=this.b-this.f/0.3010299956639812,b<-149||a==0?(a*=0):b>129?(a*=Infinity):(a=_e(ag(this))),a};_.gC=function Wg(){return Qc};_.hC=function Xg(){return Gf(this)};_.B=function Yg(){return this.f<=-32||this.f>(this.e>0?this.e:el((this.b-1)*0.3010299956639812)+1)?0:Mi(new Pi(this.f==0||this.b==0&&this.g!=-1?(!this.d&&(this.d=Li(this.g)),this.d):this.f<0?ei((!this.d&&(this.d=Li(this.g)),this.d),po(-this.f)):Th((!this.d&&(this.d=Li(this.g)),this.d),po(this.f))))};_.C=function Zg(){return Je(bg(this,32))};_.D=function $g(){return Je(bg(this,32))};_.E=function _g(){return _e(ag(this))};_.F=function ah(a){return new Kg(vf(this,a)>=0?this:a)};_.G=function bh(a){return new Kg(vf(this,a)<=0?this:a)};_.H=function ch(a){return new Kg(Jf(this,this.f+a))};_.I=function dh(a){return new Kg(Jf(this,this.f-a))};_.J=function eh(a){var b,c,d;d=Lj(a);if(d==ps)b=Kf(this,new mg(a[0].toString()));else if(d==qs)b=Lf(this,new mg(a[0].toString()),new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.multiply: '+d);c=new Kg(b);return c};_.K=function fh(a){var b,c,d;d=Lj(a);if(d==Lr)b=Mf(this);else if(d==os)b=Mf(Qf(this,new Yn(a[0].toString())));else throw new V('Unknown call signature for interim = super.negate: '+d);c=new Kg(b);return c};_.L=function gh(a){var b,c,d;d=Lj(a);if(d==Lr)b=this;else if(d==os)b=Qf(this,new Yn(a[0].toString()));else throw new V('Unknown call signature for interim = super.plus: '+d);c=new Kg(b);return c};_.M=function hh(a){var b,c,d;d=Lj(a);if(d==ks)b=Nf(this,a[0]);else if(d==ls)b=Of(this,a[0],new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.pow: '+d);c=new Kg(b);return c};_.q=function ih(){return Pf(this)};_.N=function jh(a){var b,c,d;d=Lj(a);if(d==ps)b=Bf(this,new mg(a[0].toString()))[1];else if(d==qs)b=Cf(this,new mg(a[0].toString()),new Yn(a[1].toString()))[1];else throw new V('Unknown call signature for interim = super.remainder: '+d);c=new Kg(b);return c};_.O=function kh(a){return new Kg(Qf(this,new Yn(Wn(a.b))))};_.P=function lh(){return Bc(this.f)};_.Q=function mh(a){return new Kg(Rf(this,a))};_.R=function nh(a){var b,c,d;d=Lj(a);if(d==ks)b=Sf(this,a[0],(Qo(),Go));else if(d==ns)b=Sf(this,a[0],Uo(a[1]));else if(d=='number RoundingMode')b=Sf(this,a[0],To(a[1].toString()));else throw new V('Unknown call signature for interim = super.setScale: '+d);c=new Kg(b);return c};_.S=function oh(){return ~~(Je(bg(this,16))<<16)>>16};_.r=function ph(){return Uf(this)};_.T=function qh(){return new Kg(Wf(this))};_.U=function rh(a){var b,c,d;d=Lj(a);if(d==ps)b=Xf(this,new mg(a[0].toString()));else if(d==qs)b=Yf(this,new mg(a[0].toString()),new Yn(a[1].toString()));else throw new V('Unknown call signature for interim = super.subtract: '+d);c=new Kg(b);return c};_.V=function sh(){return new Pi(this.f==0||this.b==0&&this.g!=-1?(!this.d&&(this.d=Li(this.g)),this.d):this.f<0?ei((!this.d&&(this.d=Li(this.g)),this.d),po(-this.f)):Th((!this.d&&(this.d=Li(this.g)),this.d),po(this.f)))};_.W=function th(){return new Pi(Zf(this))};_.X=function uh(){return $f(this)};_.Y=function vh(){return _f(this)};_.tS=function wh(){return ag(this)};_.Z=function xh(){return new Kg(new pg(1,this.f))};_.$=function yh(){return new Pi((!this.d&&(this.d=Li(this.g)),this.d))};_.cM={3:1,6:1,8:1,10:1,16:1,24:1};_=Eh.prototype=Ah.prototype=new H;_.gC=function Fh(){return Pc};var Bh=false;_=ui.prototype=ti.prototype=si.prototype=ri.prototype=qi.prototype=pi.prototype=oi.prototype=ni.prototype=Hh.prototype=new Ze;_._=function vi(){return this.f<0?new si(1,this.e,this.b):this};_.ab=function wi(){return sm(this)};_.eQ=function xi(a){return Vh(this,a)};_.gC=function yi(){return qd};_.bb=function zi(){return $h(this)};_.hC=function Bi(){return _h(this)};_.cb=function Ci(){return this.f==0?this:new si(-this.f,this.e,this.b)};_.db=function Di(a){return gi(this,a)};_.eb=function Fi(a){return ji(this,a)};_.fb=function Gi(a){return li(this,a)};_.r=function Hi(){return this.f};_.gb=function Ii(a){return mi(this,a)};_.tS=function Ji(){return Hm(this,0)};_.cM={6:1,8:1,10:1,17:1};_.b=null;_.c=-2;_.d=0;_.e=0;_.f=0;var Ih,Jh,Kh,Lh,Mh=null,Nh;_=Pi.prototype=Oi.prototype=Ni.prototype=Gh.prototype=new Hh;_._=function Ri(){return new Pi(this.f<0?new si(1,this.e,this.b):this)};_.hb=function Si(a){return new Pi(fn(this,a))};_.ib=function Ti(a){return new Pi(vn(this,a))};_.jb=function Ui(a){return new Pi(yn(this,a))};_.kb=function Vi(){return rm(this)};_.ab=function Wi(){return sm(this)};_.lb=function Xi(a){return new Pi(Ph(this,a))};_.mb=function Yi(a){return Qh(this,a)};_.nb=function Zi(a){return new Pi(Th(this,a))};_.ob=function $i(a){var b,c,d;c=Uh(this,a);d=lc(Rd,{6:1},4,c.length,0);for(b=0;b<c.length;++b)d[b]=new Pi(c[b]);return d};_.z=function _i(){return _e(Hm(this,0))};_.eQ=function aj(a){return Vh(this,a)};_.pb=function bj(a){return new Pi(Xh(this,a))};_.A=function cj(){return Pk(Hm(this,0))};_.qb=function dj(a){return new Pi(Yh(this,a))};_.gC=function ej(){return Sc};_.bb=function fj(){return $h(this)};_.hC=function gj(){return _h(this)};_.B=function hj(){return Mi(this)};_.rb=function ij(a){return vo(new Pi(this.f<0?new si(1,this.e,this.b):this),a)};_.sb=function jj(){return _e(Hm(this,0))};_.tb=function kj(a){return new Pi(Qh(this,a)==1?this:a)};_.ub=function lj(a){return new Pi(Qh(this,a)==-1?this:a)};_.vb=function mj(a){return new Pi(bi(this,a))};_.wb=function nj(a){return new Pi(ci(this,a))};_.xb=function oj(a,b){return new Pi(di(this,a,b))};_.yb=function pj(a){return new Pi(ei(this,a))};_.cb=function qj(){return new Pi(this.f==0?this:new si(-this.f,this.e,this.b))};_.zb=function rj(){return new Pi(fi(this))};_.Ab=function sj(){return new Pi(En(this))};_.Bb=function tj(a){return new Pi(Fn(this,a))};_.db=function uj(a){return new Pi(gi(this,a))};_.Cb=function vj(a){return new Pi(hi(this,a))};_.Db=function wj(a){return new Pi(ii(this,a))};_.eb=function xj(a){return new Pi(ji(this,a))};_.fb=function yj(a){return new Pi(li(this,a))};_.r=function zj(){return this.f};_.Eb=function Aj(a){return new Pi(rn(this,a))};_.gb=function Bj(a){return mi(this,a)};_.Fb=function Cj(a){var b,c;c=Lj(a);if(c==Lr)b=Hm(this,0);else if(c==ks)b=Fm(this,a[0]);else throw new V('Unknown call signature for result = super.toString: '+c);return b};_.Gb=function Dj(a){return new Pi(Jn(this,a))};_.cM={4:1,6:1,8:1,10:1,17:1,24:1};_=Ij.prototype=Ej.prototype=new H;_.gC=function Kj(){return Rc};var Fj=false;_=Oj.prototype=Nj.prototype=Mj.prototype=new H;_.gC=function Pj(){return Uc};_.Hb=function Qj(){return this.b.b};_.Ib=function Rj(){return new bk(this.b.c)};_.hC=function Sj(){return Vn(this.b)};_.tS=function Tj(){return Wn(this.b)};_.cM={24:1};_.b=null;_=Yj.prototype=Uj.prototype=new H;_.gC=function $j(){return Tc};var Vj=false;_=bk.prototype=ak.prototype=_j.prototype=new H;_.gC=function ck(){return Wc};_.Jb=function dk(){return this.b.b};_.tS=function ek(){return this.b.b};_.cM={5:1,24:1};_.b=null;_=kk.prototype=gk.prototype=new H;_.gC=function lk(){return Vc};var hk=false;_=nk.prototype=mk.prototype=new N;_.gC=function ok(){return Xc};_.cM={6:1,12:1,15:1};_=rk.prototype=qk.prototype=pk.prototype=new N;_.gC=function sk(){return Yc};_.cM={6:1,12:1,15:1};_=wk.prototype=vk.prototype=new H;_.gC=function Bk(){return $c};_.tS=function Ck(){return ((this.c&2)!=0?'interface ':(this.c&1)!=0?Lr:'class ')+this.d};_.b=null;_.c=0;_.d=null;_=Ek.prototype=Dk.prototype=new N;_.gC=function Fk(){return Zc};_.cM={6:1,12:1,15:1};_=Ik.prototype=new H;_.eQ=function Kk(a){return this===a};_.gC=function Lk(){return _c};_.hC=function Mk(){return ob(this)};_.tS=function Nk(){return this.b};_.cM={6:1,8:1,9:1};_.b=null;_.c=0;_=Sk.prototype=Rk.prototype=Qk.prototype=new N;_.gC=function Tk(){return bd};_.cM={6:1,12:1,15:1};_=Wk.prototype=Vk.prototype=Uk.prototype=new N;_.gC=function Xk(){return cd};_.cM={6:1,12:1,15:1};_=kl.prototype=jl.prototype=il.prototype=new N;_.gC=function ll(){return dd};_.cM={6:1,12:1,15:1};var ml;_=pl.prototype=ol.prototype=new Qk;_.gC=function ql(){return ed};_.cM={6:1,12:1,15:1};_=sl.prototype=rl.prototype=new H;_.gC=function tl(){return id};_.tS=function ul(){return this.b+ds+this.d+'(Unknown Source'+(this.c>=0?Qr+this.c:Lr)+')'};_.cM={6:1,13:1};_.b=null;_.c=0;_.d=null;_=String.prototype;_.eQ=function Hl(a){return wl(this,a)};_.gC=function Il(){return md};_.hC=function Jl(){return Rl(this)};_.tS=function Kl(){return this};_.cM={1:1,6:1,7:1,8:1};var Ml,Nl=0,Ol;_=Ul.prototype=Tl.prototype=new H;_.gC=function Vl(){return jd};_.tS=function Wl(){return this.b.b};_.cM={7:1};_=hm.prototype=gm.prototype=fm.prototype=Xl.prototype=new H;_.gC=function im(){return kd};_.tS=function jm(){return this.b.b};_.cM={7:1};_=lm.prototype=km.prototype=new Uk;_.gC=function mm(){return ld};_.cM={6:1,12:1,14:1,15:1};_=pm.prototype=om.prototype=new N;_.gC=function qm(){return od};_.cM={6:1,12:1,15:1};var Cm,Dm;_=Yn.prototype=Xn.prototype=Nn.prototype=new H;_.eQ=function Zn(a){return xc(a,18)&&vc(a,18).b==this.b&&vc(a,18).c==this.c};_.gC=function $n(){return rd};_.hC=function _n(){return Vn(this)};_.tS=function ao(){return Wn(this)};_.cM={6:1,18:1};_.b=0;_.c=null;var On,Pn,Qn,Rn,Sn,Tn;var bo,co,eo,fo;var ro,so,to;_=Ro.prototype=yo.prototype=new Ik;_.gC=function So(){return sd};_.cM={6:1,8:1,9:1,19:1};var zo,Ao,Bo,Co,Do,Eo,Fo,Go,Ho,Io,Jo,Ko,Lo,Mo,No,Oo,Po;var Xo;_=Zo.prototype=new H;_.Kb=function _o(a){throw new pm};_.Lb=function ap(a){var b;b=$o(this.Mb(),a);return !!b};_.gC=function bp(){return td};_.tS=function cp(){var a,b,c,d;c=new Ul;a=null;c.b.b+=Rr;b=this.Mb();while(b.Pb()){a!=null?(cc(c.b,a),c):(a=Is);d=b.Qb();cc(c.b,d===this?'(this Collection)':Lr+d)}c.b.b+=']';return c.b.b};_=ep.prototype=new H;_.eQ=function fp(a){var b,c,d,e,f;if(a===this){return true}if(!xc(a,21)){return false}e=vc(a,21);if(this.e!=e.e){return false}for(c=new Ip((new Cp(e)).b);kq(c.b);){b=vc(lq(c.b),22);d=b.Rb();f=b.Sb();if(!(d==null?this.d:xc(d,1)?Qr+vc(d,1) in this.f:pp(this,d,~~fb(d)))){return false}if(!Xq(f,d==null?this.c:xc(d,1)?op(this,vc(d,1)):np(this,d,~~fb(d)))){return false}}return true};_.gC=function gp(){return Cd};_.hC=function hp(){var a,b,c;c=0;for(b=new Ip((new Cp(this)).b);kq(b.b);){a=vc(lq(b.b),22);c+=a.hC();c=~~c}return c};_.tS=function ip(){var a,b,c,d;d='{';a=false;for(c=new Ip((new Cp(this)).b);kq(c.b);){b=vc(lq(c.b),22);a?(d+=Is):(a=true);d+=Lr+b.Rb();d+=Js;d+=Lr+b.Sb()}return d+'}'};_.cM={21:1};_=dp.prototype=new ep;_.Ob=function vp(a,b){return Ac(a)===Ac(b)||a!=null&&eb(a,b)};_.gC=function wp(){return yd};_.cM={21:1};_.b=null;_.c=null;_.d=false;_.e=0;_.f=null;_=yp.prototype=new Zo;_.eQ=function zp(a){var b,c,d;if(a===this){return true}if(!xc(a,23)){return false}c=vc(a,23);if(c.b.e!=this.Nb()){return false}for(b=new Ip(c.b);kq(b.b);){d=vc(lq(b.b),22);if(!this.Lb(d)){return false}}return true};_.gC=function Ap(){return Dd};_.hC=function Bp(){var a,b,c;a=0;for(b=this.Mb();b.Pb();){c=b.Qb();if(c!=null){a+=fb(c);a=~~a}}return a};_.cM={23:1};_=Cp.prototype=xp.prototype=new yp;_.Lb=function Dp(a){var b,c,d;if(xc(a,22)){b=vc(a,22);c=b.Rb();if(lp(this.b,c)){d=mp(this.b,c);return Eq(b.Sb(),d)}}return false};_.gC=function Ep(){return vd};_.Mb=function Fp(){return new Ip(this.b)};_.Nb=function Gp(){return this.b.e};_.cM={23:1};_.b=null;_=Ip.prototype=Hp.prototype=new H;_.gC=function Jp(){return ud};_.Pb=function Kp(){return kq(this.b)};_.Qb=function Lp(){return vc(lq(this.b),22)};_.b=null;_=Np.prototype=new H;_.eQ=function Op(a){var b;if(xc(a,22)){b=vc(a,22);if(Xq(this.Rb(),b.Rb())&&Xq(this.Sb(),b.Sb())){return true}}return false};_.gC=function Pp(){return Bd};_.hC=function Qp(){var a,b;a=0;b=0;this.Rb()!=null&&(a=fb(this.Rb()));this.Sb()!=null&&(b=fb(this.Sb()));return a^b};_.tS=function Rp(){return this.Rb()+Js+this.Sb()};_.cM={22:1};_=Sp.prototype=Mp.prototype=new Np;_.gC=function Tp(){return wd};_.Rb=function Up(){return null};_.Sb=function Vp(){return this.b.c};_.Tb=function Wp(a){return tp(this.b,a)};_.cM={22:1};_.b=null;_=Yp.prototype=Xp.prototype=new Np;_.gC=function Zp(){return xd};_.Rb=function $p(){return this.b};_.Sb=function _p(){return op(this.c,this.b)};_.Tb=function aq(a){return up(this.c,this.b,a)};_.cM={22:1};_.b=null;_.c=null;_=bq.prototype=new Zo;_.Kb=function cq(a){sq(this,this.Nb(),a);return true};_.eQ=function eq(a){var b,c,d,e,f;if(a===this){return true}if(!xc(a,20)){return false}f=vc(a,20);if(this.Nb()!=f.c){return false}d=new mq(this);e=new mq(f);while(d.b<d.c.c){b=lq(d);c=lq(e);if(!(b==null?c==null:eb(b,c))){return false}}return true};_.gC=function fq(){return Ad};_.hC=function gq(){var a,b,c;b=1;a=new mq(this);while(a.b<a.c.c){c=lq(a);b=31*b+(c==null?0:fb(c));b=~~b}return b};_.Mb=function iq(){return new mq(this)};_.cM={20:1};_=mq.prototype=jq.prototype=new H;_.gC=function nq(){return zd};_.Pb=function oq(){return kq(this)};_.Qb=function pq(){return lq(this)};_.b=0;_.c=null;_=vq.prototype=qq.prototype=new bq;_.Kb=function wq(a){return rq(this,a)};_.Lb=function xq(a){return uq(this,a,0)!=-1};_.gC=function yq(){return Ed};_.Nb=function zq(){return this.c};_.cM={6:1,20:1};_.c=0;_=Fq.prototype=Dq.prototype=new dp;_.gC=function Gq(){return Fd};_.cM={6:1,21:1};_=Iq.prototype=Hq.prototype=new Np;_.gC=function Jq(){return Gd};_.Rb=function Kq(){return this.b};_.Sb=function Lq(){return this.c};_.Tb=function Mq(a){var b;b=this.c;this.c=a;return b};_.cM={22:1};_.b=null;_.c=null;_=Oq.prototype=Nq.prototype=new N;_.gC=function Pq(){return Hd};_.cM={6:1,12:1,15:1};_=Vq.prototype=Qq.prototype=new H;_.gC=function Wq(){return Id};_.b=0;_.c=0;var Rq,Sq,Tq=0;_=Zq.prototype=new H;_.gC=function $q(){return Kd};_=gr.prototype=Yq.prototype=new Zq;_.gC=function hr(){return Jd};var kr;var Jr=mb;var gd=yk(Ms,'Object'),_c=yk(Ms,'Enum'),nd=yk(Ms,'Throwable'),ad=yk(Ms,'Exception'),hd=yk(Ms,'RuntimeException'),Fc=yk(Ns,'JavaScriptException'),Gc=yk(Ns,'JavaScriptObject$'),Hc=yk(Ns,'Scheduler'),Ec=Ak('int'),Od=xk(Lr,'[I',Ec),Td=xk(Os,'Object;',gd),Ld=Ak('boolean'),Zd=xk(Lr,'[Z',Ld),Ic=yk(Ps,'SchedulerImpl'),Lc=yk(Ps,'StackTraceCreator$Collector'),id=yk(Ms,'StackTraceElement'),Ud=xk(Os,'StackTraceElement;',id),Kc=yk(Ps,'StackTraceCreator$CollectorMoz'),Jc=yk(Ps,'StackTraceCreator$CollectorChrome'),Nc=yk(Ps,'StringBufferImpl'),Mc=yk(Ps,'StringBufferImplAppend'),md=yk(Ms,Nr),Vd=xk(Os,'String;',md),Oc=yk('com.google.gwt.lang.','LongLibBase$LongEmul'),Pd=xk('[Lcom.google.gwt.lang.','LongLibBase$LongEmul;',Oc),fd=yk(Ms,'Number'),pd=yk(Qs,ps),Qc=yk(Rs,ps),Qd=xk(Ss,Ts,Qc),Pc=yk(Rs,'BigDecimalExporterImpl'),qd=yk(Qs,is),Sc=yk(Rs,is),Rd=xk(Ss,Us,Sc),Rc=yk(Rs,'BigIntegerExporterImpl'),Uc=yk(Rs,os),Tc=yk(Rs,'MathContextExporterImpl'),Wc=yk(Rs,xs),Sd=xk(Ss,Vs,Wc),Vc=yk(Rs,'RoundingModeExporterImpl'),Xc=yk(Ms,'ArithmeticException'),cd=yk(Ms,'IndexOutOfBoundsException'),Yc=yk(Ms,'ArrayStoreException'),Cc=Ak('char'),Md=xk(Lr,'[C',Cc),$c=yk(Ms,'Class'),Zc=yk(Ms,'ClassCastException'),bd=yk(Ms,'IllegalArgumentException'),dd=yk(Ms,'NullPointerException'),ed=yk(Ms,'NumberFormatException'),jd=yk(Ms,'StringBuffer'),kd=yk(Ms,'StringBuilder'),ld=yk(Ms,'StringIndexOutOfBoundsException'),od=yk(Ms,'UnsupportedOperationException'),Wd=xk(Ws,Ts,pd),Dc=Ak('double'),Nd=xk(Lr,'[D',Dc),Xd=xk(Ws,Us,qd),rd=yk(Qs,os),sd=zk(Qs,xs,Wo),Yd=xk(Ws,Vs,sd),td=yk(Xs,'AbstractCollection'),Cd=yk(Xs,'AbstractMap'),yd=yk(Xs,'AbstractHashMap'),Dd=yk(Xs,'AbstractSet'),vd=yk(Xs,'AbstractHashMap$EntrySet'),ud=yk(Xs,'AbstractHashMap$EntrySetIterator'),Bd=yk(Xs,'AbstractMapEntry'),wd=yk(Xs,'AbstractHashMap$MapEntryNull'),xd=yk(Xs,'AbstractHashMap$MapEntryString'),Ad=yk(Xs,'AbstractList'),zd=yk(Xs,'AbstractList$IteratorImpl'),Ed=yk(Xs,'ArrayList'),Fd=yk(Xs,'HashMap'),Gd=yk(Xs,'MapEntryImpl'),Hd=yk(Xs,'NoSuchElementException'),Id=yk(Xs,'Random'),Kd=yk(Ys,'ExporterBaseImpl'),Jd=yk(Ys,'ExporterBaseActual');$stats && $stats({moduleName:'gwtapp',sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date()).getTime(),type:'moduleEvalEnd'});if (gwtapp && gwtapp.onScriptLoad)gwtapp.onScriptLoad(gwtOnLoad);
gwtOnLoad(null, 'ModuleName', 'moduleBase');
})();

exports.RoundingMode = window.bigdecimal.RoundingMode;
exports.MathContext = window.bigdecimal.MathContext;

fix_and_export('BigDecimal');
fix_and_export('BigInteger');

// This is an unfortunate kludge because Java methods and constructors cannot accept vararg parameters.
function fix_and_export(class_name) {
  var Src = window.bigdecimal[class_name];
  var Fixed = Src;
  if(Src.__init__) {
    Fixed = function wrap_constructor() {
      var args = Array.prototype.slice.call(arguments);
      return Src.__init__(args);
    };

    Fixed.prototype = Src.prototype;

    for (var a in Src)
      if(Src.hasOwnProperty(a)) {
        if((typeof Src[a] != 'function') || !a.match(/_va$/))
          Fixed[a] = Src[a];
        else {
          var pub_name = a.replace(/_va$/, '');
          Fixed[pub_name] = function wrap_classmeth () {
            var args = Array.prototype.slice.call(arguments);
            return wrap_classmeth.inner_method(args);
          };
          Fixed[pub_name].inner_method = Src[a];
        }
      }

  }

  var proto = Fixed.prototype;
  for (var a in proto) {
    if(proto.hasOwnProperty(a) && (typeof proto[a] == 'function') && a.match(/_va$/)) {
      var pub_name = a.replace(/_va$/, '');
      proto[pub_name] = function wrap_meth() {
        var args = Array.prototype.slice.call(arguments);
        return wrap_meth.inner_method.apply(this, [args]);
      };
      proto[pub_name].inner_method = proto[a];
      delete proto[a];
    }
  }

  exports[class_name] = Fixed;
}

})(typeof exports !== 'undefined' ? exports : (typeof window !== 'undefined' ? window : {}));

},{}],3:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,i=t.BlockCipher,o=r.algo,n=[],c=[],s=[],a=[],f=[],u=[],h=[],p=[],d=[],l=[];(function(){for(var e=[],r=0;256>r;r++)e[r]=128>r?r<<1:283^r<<1;for(var t=0,i=0,r=0;256>r;r++){var o=i^i<<1^i<<2^i<<3^i<<4;o=99^(o>>>8^255&o),n[t]=o,c[o]=t;var y=e[t],v=e[y],m=e[v],x=257*e[o]^16843008*o;s[t]=x<<24|x>>>8,a[t]=x<<16|x>>>16,f[t]=x<<8|x>>>24,u[t]=x;var x=16843009*m^65537*v^257*y^16843008*t;h[o]=x<<24|x>>>8,p[o]=x<<16|x>>>16,d[o]=x<<8|x>>>24,l[o]=x,t?(t=y^e[e[e[m^y]]],i^=e[e[i]]):t=i=1}})();var y=[0,1,2,4,8,16,32,64,128,27,54],v=o.AES=i.extend({_doReset:function(){for(var e=this._key,r=e.words,t=e.sigBytes/4,i=this._nRounds=t+6,o=4*(i+1),c=this._keySchedule=[],s=0;o>s;s++)if(t>s)c[s]=r[s];else{var a=c[s-1];s%t?t>6&&4==s%t&&(a=n[a>>>24]<<24|n[255&a>>>16]<<16|n[255&a>>>8]<<8|n[255&a]):(a=a<<8|a>>>24,a=n[a>>>24]<<24|n[255&a>>>16]<<16|n[255&a>>>8]<<8|n[255&a],a^=y[0|s/t]<<24),c[s]=c[s-t]^a}for(var f=this._invKeySchedule=[],u=0;o>u;u++){var s=o-u;if(u%4)var a=c[s];else var a=c[s-4];f[u]=4>u||4>=s?a:h[n[a>>>24]]^p[n[255&a>>>16]]^d[n[255&a>>>8]]^l[n[255&a]]}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,s,a,f,u,n)},decryptBlock:function(e,r){var t=e[r+1];e[r+1]=e[r+3],e[r+3]=t,this._doCryptBlock(e,r,this._invKeySchedule,h,p,d,l,c);var t=e[r+1];e[r+1]=e[r+3],e[r+3]=t},_doCryptBlock:function(e,r,t,i,o,n,c,s){for(var a=this._nRounds,f=e[r]^t[0],u=e[r+1]^t[1],h=e[r+2]^t[2],p=e[r+3]^t[3],d=4,l=1;a>l;l++){var y=i[f>>>24]^o[255&u>>>16]^n[255&h>>>8]^c[255&p]^t[d++],v=i[u>>>24]^o[255&h>>>16]^n[255&p>>>8]^c[255&f]^t[d++],m=i[h>>>24]^o[255&p>>>16]^n[255&f>>>8]^c[255&u]^t[d++],x=i[p>>>24]^o[255&f>>>16]^n[255&u>>>8]^c[255&h]^t[d++];f=y,u=v,h=m,p=x}var y=(s[f>>>24]<<24|s[255&u>>>16]<<16|s[255&h>>>8]<<8|s[255&p])^t[d++],v=(s[u>>>24]<<24|s[255&h>>>16]<<16|s[255&p>>>8]<<8|s[255&f])^t[d++],m=(s[h>>>24]<<24|s[255&p>>>16]<<16|s[255&f>>>8]<<8|s[255&u])^t[d++],x=(s[p>>>24]<<24|s[255&f>>>16]<<16|s[255&u>>>8]<<8|s[255&h])^t[d++];e[r]=y,e[r+1]=v,e[r+2]=m,e[r+3]=x},keySize:8});r.AES=i._createHelper(v)}(),e.AES});
},{"./cipher-core":4,"./core":5,"./enc-base64":6,"./evpkdf":8,"./md5":13}],4:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){e.lib.Cipher||function(r){var t=e,i=t.lib,n=i.Base,o=i.WordArray,c=i.BufferedBlockAlgorithm,a=t.enc;a.Utf8;var s=a.Base64,f=t.algo,u=f.EvpKDF,h=i.Cipher=c.extend({cfg:n.extend(),createEncryptor:function(e,r){return this.create(this._ENC_XFORM_MODE,e,r)},createDecryptor:function(e,r){return this.create(this._DEC_XFORM_MODE,e,r)},init:function(e,r,t){this.cfg=this.cfg.extend(t),this._xformMode=e,this._key=r,this.reset()},reset:function(){c.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){e&&this._append(e);var r=this._doFinalize();return r},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?q:_}return function(r){return{encrypt:function(t,i,n){return e(i).encrypt(r,t,i,n)},decrypt:function(t,i,n){return e(i).decrypt(r,t,i,n)}}}}()});i.StreamCipher=h.extend({_doFinalize:function(){var e=this._process(true);return e},blockSize:1});var d=t.mode={},p=i.BlockCipherMode=n.extend({createEncryptor:function(e,r){return this.Encryptor.create(e,r)},createDecryptor:function(e,r){return this.Decryptor.create(e,r)},init:function(e,r){this._cipher=e,this._iv=r}}),l=d.CBC=function(){function e(e,t,i){var n=this._iv;if(n){var o=n;this._iv=r}else var o=this._prevBlock;for(var c=0;i>c;c++)e[t+c]^=o[c]}var t=p.extend();return t.Encryptor=t.extend({processBlock:function(r,t){var i=this._cipher,n=i.blockSize;e.call(this,r,t,n),i.encryptBlock(r,t),this._prevBlock=r.slice(t,t+n)}}),t.Decryptor=t.extend({processBlock:function(r,t){var i=this._cipher,n=i.blockSize,o=r.slice(t,t+n);i.decryptBlock(r,t),e.call(this,r,t,n),this._prevBlock=o}}),t}(),y=t.pad={},v=y.Pkcs7={pad:function(e,r){for(var t=4*r,i=t-e.sigBytes%t,n=i<<24|i<<16|i<<8|i,c=[],a=0;i>a;a+=4)c.push(n);var s=o.create(c,i);e.concat(s)},unpad:function(e){var r=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=r}};i.BlockCipher=h.extend({cfg:h.cfg.extend({mode:l,padding:v}),reset:function(){h.reset.call(this);var e=this.cfg,r=e.iv,t=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=t.createEncryptor;else{var i=t.createDecryptor;this._minBufferSize=1}this._mode=i.call(t,this,r&&r.words)},_doProcessBlock:function(e,r){this._mode.processBlock(e,r)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var r=this._process(true)}else{var r=this._process(true);e.unpad(r)}return r},blockSize:4});var g=i.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}}),m=t.format={},x=m.OpenSSL={stringify:function(e){var r=e.ciphertext,t=e.salt;if(t)var i=o.create([1398893684,1701076831]).concat(t).concat(r);else var i=r;return i.toString(s)},parse:function(e){var r=s.parse(e),t=r.words;if(1398893684==t[0]&&1701076831==t[1]){var i=o.create(t.slice(2,4));t.splice(0,4),r.sigBytes-=16}return g.create({ciphertext:r,salt:i})}},_=i.SerializableCipher=n.extend({cfg:n.extend({format:x}),encrypt:function(e,r,t,i){i=this.cfg.extend(i);var n=e.createEncryptor(t,i),o=n.finalize(r),c=n.cfg;return g.create({ciphertext:o,key:t,iv:c.iv,algorithm:e,mode:c.mode,padding:c.padding,blockSize:e.blockSize,formatter:i.format})},decrypt:function(e,r,t,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=e.createDecryptor(t,i).finalize(r.ciphertext);return n},_parse:function(e,r){return"string"==typeof e?r.parse(e,this):e}}),w=t.kdf={},S=w.OpenSSL={execute:function(e,r,t,i){i||(i=o.random(8));var n=u.create({keySize:r+t}).compute(e,i),c=o.create(n.words.slice(r),4*t);return n.sigBytes=4*r,g.create({key:n,iv:c,salt:i})}},q=i.PasswordBasedCipher=_.extend({cfg:_.cfg.extend({kdf:S}),encrypt:function(e,r,t,i){i=this.cfg.extend(i);var n=i.kdf.execute(t,e.keySize,e.ivSize);i.iv=n.iv;var o=_.encrypt.call(this,e,r,n.key,i);return o.mixIn(n),o},decrypt:function(e,r,t,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=i.kdf.execute(t,e.keySize,e.ivSize,r.salt);i.iv=n.iv;var o=_.decrypt.call(this,e,r,n.key,i);return o}})}()});
},{"./core":5}],5:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r():"function"==typeof define&&define.amd?define([],r):e.CryptoJS=r()})(this,function(){var e=e||function(e,r){var t={},i=t.lib={},n=i.Base=function(){function e(){}return{extend:function(r){e.prototype=this;var t=new e;return r&&t.mixIn(r),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),o=i.WordArray=n.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=t!=r?t:4*e.length},toString:function(e){return(e||s).stringify(this)},concat:function(e){var r=this.words,t=e.words,i=this.sigBytes,n=e.sigBytes;if(this.clamp(),i%4)for(var o=0;n>o;o++){var c=255&t[o>>>2]>>>24-8*(o%4);r[i+o>>>2]|=c<<24-8*((i+o)%4)}else if(t.length>65535)for(var o=0;n>o;o+=4)r[i+o>>>2]=t[o>>>2];else r.push.apply(r,t);return this.sigBytes+=n,this},clamp:function(){var r=this.words,t=this.sigBytes;r[t>>>2]&=4294967295<<32-8*(t%4),r.length=e.ceil(t/4)},clone:function(){var e=n.clone.call(this);return e.words=this.words.slice(0),e},random:function(r){for(var t=[],i=0;r>i;i+=4)t.push(0|4294967296*e.random());return new o.init(t,r)}}),c=t.enc={},s=c.Hex={stringify:function(e){for(var r=e.words,t=e.sigBytes,i=[],n=0;t>n;n++){var o=255&r[n>>>2]>>>24-8*(n%4);i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(e){for(var r=e.length,t=[],i=0;r>i;i+=2)t[i>>>3]|=parseInt(e.substr(i,2),16)<<24-4*(i%8);return new o.init(t,r/2)}},u=c.Latin1={stringify:function(e){for(var r=e.words,t=e.sigBytes,i=[],n=0;t>n;n++){var o=255&r[n>>>2]>>>24-8*(n%4);i.push(String.fromCharCode(o))}return i.join("")},parse:function(e){for(var r=e.length,t=[],i=0;r>i;i++)t[i>>>2]|=(255&e.charCodeAt(i))<<24-8*(i%4);return new o.init(t,r)}},f=c.Utf8={stringify:function(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(r){throw Error("Malformed UTF-8 data")}},parse:function(e){return u.parse(unescape(encodeURIComponent(e)))}},a=i.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=f.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(r){var t=this._data,i=t.words,n=t.sigBytes,c=this.blockSize,s=4*c,u=n/s;u=r?e.ceil(u):e.max((0|u)-this._minBufferSize,0);var f=u*c,a=e.min(4*f,n);if(f){for(var p=0;f>p;p+=c)this._doProcessBlock(i,p);var d=i.splice(0,f);t.sigBytes-=a}return new o.init(d,a)},clone:function(){var e=n.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});i.Hasher=a.extend({cfg:n.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){a.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){e&&this._append(e);var r=this._doFinalize();return r},blockSize:16,_createHelper:function(e){return function(r,t){return new e.init(t).finalize(r)}},_createHmacHelper:function(e){return function(r,t){return new p.HMAC.init(e,t).finalize(r)}}});var p=t.algo={};return t}(Math);return e});
},{}],6:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.WordArray,i=r.enc;i.Base64={stringify:function(e){var r=e.words,t=e.sigBytes,n=this._map;e.clamp();for(var i=[],o=0;t>o;o+=3)for(var s=255&r[o>>>2]>>>24-8*(o%4),c=255&r[o+1>>>2]>>>24-8*((o+1)%4),a=255&r[o+2>>>2]>>>24-8*((o+2)%4),f=s<<16|c<<8|a,u=0;4>u&&t>o+.75*u;u++)i.push(n.charAt(63&f>>>6*(3-u)));var d=n.charAt(64);if(d)for(;i.length%4;)i.push(d);return i.join("")},parse:function(e){var r=e.length,t=this._map,i=t.charAt(64);if(i){var o=e.indexOf(i);-1!=o&&(r=o)}for(var s=[],c=0,a=0;r>a;a++)if(a%4){var f=t.indexOf(e.charAt(a-1))<<2*(a%4),u=t.indexOf(e.charAt(a))>>>6-2*(a%4);s[c>>>2]|=(f|u)<<24-8*(c%4),c++}return n.create(s,c)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),e.enc.Base64});
},{"./core":5}],7:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(e){return 4278255360&e<<8|16711935&e>>>8}var t=e,n=t.lib,i=n.WordArray,o=t.enc;o.Utf16=o.Utf16BE={stringify:function(e){for(var r=e.words,t=e.sigBytes,n=[],i=0;t>i;i+=2){var o=65535&r[i>>>2]>>>16-8*(i%4);n.push(String.fromCharCode(o))}return n.join("")},parse:function(e){for(var r=e.length,t=[],n=0;r>n;n++)t[n>>>1]|=e.charCodeAt(n)<<16-16*(n%2);return i.create(t,2*r)}},o.Utf16LE={stringify:function(e){for(var t=e.words,n=e.sigBytes,i=[],o=0;n>o;o+=2){var c=r(65535&t[o>>>2]>>>16-8*(o%4));i.push(String.fromCharCode(c))}return i.join("")},parse:function(e){for(var t=e.length,n=[],o=0;t>o;o++)n[o>>>1]|=r(e.charCodeAt(o)<<16-16*(o%2));return i.create(n,2*t)}}}(),e.enc.Utf16});
},{"./core":5}],8:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./sha1"),require("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha1","./hmac"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.Base,i=t.WordArray,o=r.algo,a=o.MD5,s=o.EvpKDF=n.extend({cfg:n.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,r){for(var t=this.cfg,n=t.hasher.create(),o=i.create(),a=o.words,s=t.keySize,c=t.iterations;s>a.length;){f&&n.update(f);var f=n.update(e).finalize(r);n.reset();for(var u=1;c>u;u++)f=n.finalize(f),n.reset();o.concat(f)}return o.sigBytes=4*s,o}});r.EvpKDF=function(e,r,t){return s.create(t).compute(e,r)}}(),e.EvpKDF});
},{"./core":5,"./hmac":10,"./sha1":29}],9:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,i=t.CipherParams,o=r.enc,n=o.Hex,c=r.format;c.Hex={stringify:function(e){return e.ciphertext.toString(n)},parse:function(e){var r=n.parse(e);return i.create({ciphertext:r})}}}(),e.format.Hex});
},{"./cipher-core":4,"./core":5}],10:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){(function(){var r=e,t=r.lib,i=t.Base,n=r.enc,o=n.Utf8,c=r.algo;c.HMAC=i.extend({init:function(e,r){e=this._hasher=new e.init,"string"==typeof r&&(r=o.parse(r));var t=e.blockSize,i=4*t;r.sigBytes>i&&(r=e.finalize(r)),r.clamp();for(var n=this._oKey=r.clone(),c=this._iKey=r.clone(),s=n.words,a=c.words,f=0;t>f;f++)s[f]^=1549556828,a[f]^=909522486;n.sigBytes=c.sigBytes=i,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var r=this._hasher,t=r.finalize(e);r.reset();var i=r.finalize(this._oKey.clone().concat(t));return i}})})()});
},{"./core":5}],11:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./x64-core"),require("./lib-typedarrays"),require("./enc-utf16"),require("./enc-base64"),require("./md5"),require("./sha1"),require("./sha256"),require("./sha224"),require("./sha512"),require("./sha384"),require("./sha3"),require("./ripemd160"),require("./hmac"),require("./pbkdf2"),require("./evpkdf"),require("./cipher-core"),require("./mode-cfb"),require("./mode-ctr"),require("./mode-ctr-gladman"),require("./mode-ofb"),require("./mode-ecb"),require("./pad-ansix923"),require("./pad-iso10126"),require("./pad-iso97971"),require("./pad-zeropadding"),require("./pad-nopadding"),require("./format-hex"),require("./aes"),require("./tripledes"),require("./rc4"),require("./rabbit"),require("./rabbit-legacy")):"function"==typeof define&&define.amd?define(["./core","./x64-core","./lib-typedarrays","./enc-utf16","./enc-base64","./md5","./sha1","./sha256","./sha224","./sha512","./sha384","./sha3","./ripemd160","./hmac","./pbkdf2","./evpkdf","./cipher-core","./mode-cfb","./mode-ctr","./mode-ctr-gladman","./mode-ofb","./mode-ecb","./pad-ansix923","./pad-iso10126","./pad-iso97971","./pad-zeropadding","./pad-nopadding","./format-hex","./aes","./tripledes","./rc4","./rabbit","./rabbit-legacy"],r):r(e.CryptoJS)})(this,function(e){return e});
},{"./aes":3,"./cipher-core":4,"./core":5,"./enc-base64":6,"./enc-utf16":7,"./evpkdf":8,"./format-hex":9,"./hmac":10,"./lib-typedarrays":12,"./md5":13,"./mode-cfb":14,"./mode-ctr":16,"./mode-ctr-gladman":15,"./mode-ecb":17,"./mode-ofb":18,"./pad-ansix923":19,"./pad-iso10126":20,"./pad-iso97971":21,"./pad-nopadding":22,"./pad-zeropadding":23,"./pbkdf2":24,"./rabbit":26,"./rabbit-legacy":25,"./rc4":27,"./ripemd160":28,"./sha1":29,"./sha224":30,"./sha256":31,"./sha3":32,"./sha384":33,"./sha512":34,"./tripledes":35,"./x64-core":36}],12:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){if("function"==typeof ArrayBuffer){var r=e,t=r.lib,i=t.WordArray,n=i.init,o=i.init=function(e){if(e instanceof ArrayBuffer&&(e=new Uint8Array(e)),(e instanceof Int8Array||e instanceof Uint8ClampedArray||e instanceof Int16Array||e instanceof Uint16Array||e instanceof Int32Array||e instanceof Uint32Array||e instanceof Float32Array||e instanceof Float64Array)&&(e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength)),e instanceof Uint8Array){for(var r=e.byteLength,t=[],i=0;r>i;i++)t[i>>>2]|=e[i]<<24-8*(i%4);n.call(this,t,r)}else n.apply(this,arguments)};o.prototype=i}}(),e.lib.WordArray});
},{"./core":5}],13:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(r){function t(e,r,t,n,i,o,s){var c=e+(r&t|~r&n)+i+s;return(c<<o|c>>>32-o)+r}function n(e,r,t,n,i,o,s){var c=e+(r&n|t&~n)+i+s;return(c<<o|c>>>32-o)+r}function i(e,r,t,n,i,o,s){var c=e+(r^t^n)+i+s;return(c<<o|c>>>32-o)+r}function o(e,r,t,n,i,o,s){var c=e+(t^(r|~n))+i+s;return(c<<o|c>>>32-o)+r}var s=e,c=s.lib,f=c.WordArray,a=c.Hasher,u=s.algo,p=[];(function(){for(var e=0;64>e;e++)p[e]=0|4294967296*r.abs(r.sin(e+1))})();var d=u.MD5=a.extend({_doReset:function(){this._hash=new f.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,r){for(var s=0;16>s;s++){var c=r+s,f=e[c];e[c]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}var a=this._hash.words,u=e[r+0],d=e[r+1],h=e[r+2],y=e[r+3],m=e[r+4],l=e[r+5],x=e[r+6],q=e[r+7],g=e[r+8],v=e[r+9],b=e[r+10],S=e[r+11],w=e[r+12],C=e[r+13],_=e[r+14],A=e[r+15],B=a[0],H=a[1],j=a[2],J=a[3];B=t(B,H,j,J,u,7,p[0]),J=t(J,B,H,j,d,12,p[1]),j=t(j,J,B,H,h,17,p[2]),H=t(H,j,J,B,y,22,p[3]),B=t(B,H,j,J,m,7,p[4]),J=t(J,B,H,j,l,12,p[5]),j=t(j,J,B,H,x,17,p[6]),H=t(H,j,J,B,q,22,p[7]),B=t(B,H,j,J,g,7,p[8]),J=t(J,B,H,j,v,12,p[9]),j=t(j,J,B,H,b,17,p[10]),H=t(H,j,J,B,S,22,p[11]),B=t(B,H,j,J,w,7,p[12]),J=t(J,B,H,j,C,12,p[13]),j=t(j,J,B,H,_,17,p[14]),H=t(H,j,J,B,A,22,p[15]),B=n(B,H,j,J,d,5,p[16]),J=n(J,B,H,j,x,9,p[17]),j=n(j,J,B,H,S,14,p[18]),H=n(H,j,J,B,u,20,p[19]),B=n(B,H,j,J,l,5,p[20]),J=n(J,B,H,j,b,9,p[21]),j=n(j,J,B,H,A,14,p[22]),H=n(H,j,J,B,m,20,p[23]),B=n(B,H,j,J,v,5,p[24]),J=n(J,B,H,j,_,9,p[25]),j=n(j,J,B,H,y,14,p[26]),H=n(H,j,J,B,g,20,p[27]),B=n(B,H,j,J,C,5,p[28]),J=n(J,B,H,j,h,9,p[29]),j=n(j,J,B,H,q,14,p[30]),H=n(H,j,J,B,w,20,p[31]),B=i(B,H,j,J,l,4,p[32]),J=i(J,B,H,j,g,11,p[33]),j=i(j,J,B,H,S,16,p[34]),H=i(H,j,J,B,_,23,p[35]),B=i(B,H,j,J,d,4,p[36]),J=i(J,B,H,j,m,11,p[37]),j=i(j,J,B,H,q,16,p[38]),H=i(H,j,J,B,b,23,p[39]),B=i(B,H,j,J,C,4,p[40]),J=i(J,B,H,j,u,11,p[41]),j=i(j,J,B,H,y,16,p[42]),H=i(H,j,J,B,x,23,p[43]),B=i(B,H,j,J,v,4,p[44]),J=i(J,B,H,j,w,11,p[45]),j=i(j,J,B,H,A,16,p[46]),H=i(H,j,J,B,h,23,p[47]),B=o(B,H,j,J,u,6,p[48]),J=o(J,B,H,j,q,10,p[49]),j=o(j,J,B,H,_,15,p[50]),H=o(H,j,J,B,l,21,p[51]),B=o(B,H,j,J,w,6,p[52]),J=o(J,B,H,j,y,10,p[53]),j=o(j,J,B,H,b,15,p[54]),H=o(H,j,J,B,d,21,p[55]),B=o(B,H,j,J,g,6,p[56]),J=o(J,B,H,j,A,10,p[57]),j=o(j,J,B,H,x,15,p[58]),H=o(H,j,J,B,C,21,p[59]),B=o(B,H,j,J,m,6,p[60]),J=o(J,B,H,j,S,10,p[61]),j=o(j,J,B,H,h,15,p[62]),H=o(H,j,J,B,v,21,p[63]),a[0]=0|a[0]+B,a[1]=0|a[1]+H,a[2]=0|a[2]+j,a[3]=0|a[3]+J},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;t[i>>>5]|=128<<24-i%32;var o=r.floor(n/4294967296),s=n;t[(i+64>>>9<<4)+15]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t[(i+64>>>9<<4)+14]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),e.sigBytes=4*(t.length+1),this._process();for(var c=this._hash,f=c.words,a=0;4>a;a++){var u=f[a];f[a]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}return c},clone:function(){var e=a.clone.call(this);return e._hash=this._hash.clone(),e}});s.MD5=a._createHelper(d),s.HmacMD5=a._createHmacHelper(d)}(Math),e.MD5});
},{"./core":5}],14:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.CFB=function(){function r(e,r,t,i){var n=this._iv;if(n){var o=n.slice(0);this._iv=void 0}else var o=this._prevBlock;i.encryptBlock(o,0);for(var c=0;t>c;c++)e[r+c]^=o[c]}var t=e.lib.BlockCipherMode.extend();return t.Encryptor=t.extend({processBlock:function(e,t){var i=this._cipher,n=i.blockSize;r.call(this,e,t,n,i),this._prevBlock=e.slice(t,t+n)}}),t.Decryptor=t.extend({processBlock:function(e,t){var i=this._cipher,n=i.blockSize,o=e.slice(t,t+n);r.call(this,e,t,n,i),this._prevBlock=o}}),t}(),e.mode.CFB});
},{"./cipher-core":4,"./core":5}],15:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.CTRGladman=function(){function r(e){if(255===(255&e>>24)){var r=255&e>>16,t=255&e>>8,i=255&e;255===r?(r=0,255===t?(t=0,255===i?i=0:++i):++t):++r,e=0,e+=r<<16,e+=t<<8,e+=i}else e+=1<<24;return e}function t(e){return 0===(e[0]=r(e[0]))&&(e[1]=r(e[1])),e}var i=e.lib.BlockCipherMode.extend(),n=i.Encryptor=i.extend({processBlock:function(e,r){var i=this._cipher,n=i.blockSize,o=this._iv,c=this._counter;o&&(c=this._counter=o.slice(0),this._iv=void 0),t(c);var s=c.slice(0);i.encryptBlock(s,0);for(var a=0;n>a;a++)e[r+a]^=s[a]}});return i.Decryptor=n,i}(),e.mode.CTRGladman});
},{"./cipher-core":4,"./core":5}],16:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.CTR=function(){var r=e.lib.BlockCipherMode.extend(),t=r.Encryptor=r.extend({processBlock:function(e,r){var t=this._cipher,i=t.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0);var c=o.slice(0);t.encryptBlock(c,0),o[i-1]=0|o[i-1]+1;for(var s=0;i>s;s++)e[r+s]^=c[s]}});return r.Decryptor=t,r}(),e.mode.CTR});
},{"./cipher-core":4,"./core":5}],17:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.ECB=function(){var r=e.lib.BlockCipherMode.extend();return r.Encryptor=r.extend({processBlock:function(e,r){this._cipher.encryptBlock(e,r)}}),r.Decryptor=r.extend({processBlock:function(e,r){this._cipher.decryptBlock(e,r)}}),r}(),e.mode.ECB});
},{"./cipher-core":4,"./core":5}],18:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.OFB=function(){var r=e.lib.BlockCipherMode.extend(),t=r.Encryptor=r.extend({processBlock:function(e,r){var t=this._cipher,i=t.blockSize,n=this._iv,o=this._keystream;n&&(o=this._keystream=n.slice(0),this._iv=void 0),t.encryptBlock(o,0);for(var c=0;i>c;c++)e[r+c]^=o[c]}});return r.Decryptor=t,r}(),e.mode.OFB});
},{"./cipher-core":4,"./core":5}],19:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.pad.AnsiX923={pad:function(e,r){var t=e.sigBytes,i=4*r,n=i-t%i,o=t+n-1;e.clamp(),e.words[o>>>2]|=n<<24-8*(o%4),e.sigBytes+=n},unpad:function(e){var r=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=r}},e.pad.Ansix923});
},{"./cipher-core":4,"./core":5}],20:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.pad.Iso10126={pad:function(r,t){var i=4*t,o=i-r.sigBytes%i;r.concat(e.lib.WordArray.random(o-1)).concat(e.lib.WordArray.create([o<<24],1))},unpad:function(e){var r=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=r}},e.pad.Iso10126});
},{"./cipher-core":4,"./core":5}],21:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.pad.Iso97971={pad:function(r,t){r.concat(e.lib.WordArray.create([2147483648],1)),e.pad.ZeroPadding.pad(r,t)},unpad:function(r){e.pad.ZeroPadding.unpad(r),r.sigBytes--}},e.pad.Iso97971});
},{"./cipher-core":4,"./core":5}],22:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.pad.NoPadding={pad:function(){},unpad:function(){}},e.pad.NoPadding});
},{"./cipher-core":4,"./core":5}],23:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.pad.ZeroPadding={pad:function(e,r){var t=4*r;e.clamp(),e.sigBytes+=t-(e.sigBytes%t||t)},unpad:function(e){for(var r=e.words,t=e.sigBytes-1;!(255&r[t>>>2]>>>24-8*(t%4));)t--;e.sigBytes=t+1}},e.pad.ZeroPadding});
},{"./cipher-core":4,"./core":5}],24:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./sha1"),require("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha1","./hmac"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.Base,o=t.WordArray,i=r.algo,a=i.SHA1,s=i.HMAC,c=i.PBKDF2=n.extend({cfg:n.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,r){for(var t=this.cfg,n=s.create(t.hasher,e),i=o.create(),a=o.create([1]),c=i.words,f=a.words,u=t.keySize,h=t.iterations;u>c.length;){var d=n.update(r).finalize(a);n.reset();for(var p=d.words,l=p.length,y=d,m=1;h>m;m++){y=n.finalize(y),n.reset();for(var g=y.words,v=0;l>v;v++)p[v]^=g[v]}i.concat(d),f[0]++}return i.sigBytes=4*u,i}});r.PBKDF2=function(e,r,t){return c.create(t).compute(e,r)}}(),e.PBKDF2});
},{"./core":5,"./hmac":10,"./sha1":29}],25:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(){for(var e=this._X,r=this._C,t=0;8>t;t++)s[t]=r[t];r[0]=0|r[0]+1295307597+this._b,r[1]=0|r[1]+3545052371+(r[0]>>>0<s[0]>>>0?1:0),r[2]=0|r[2]+886263092+(r[1]>>>0<s[1]>>>0?1:0),r[3]=0|r[3]+1295307597+(r[2]>>>0<s[2]>>>0?1:0),r[4]=0|r[4]+3545052371+(r[3]>>>0<s[3]>>>0?1:0),r[5]=0|r[5]+886263092+(r[4]>>>0<s[4]>>>0?1:0),r[6]=0|r[6]+1295307597+(r[5]>>>0<s[5]>>>0?1:0),r[7]=0|r[7]+3545052371+(r[6]>>>0<s[6]>>>0?1:0),this._b=r[7]>>>0<s[7]>>>0?1:0;for(var t=0;8>t;t++){var i=e[t]+r[t],o=65535&i,n=i>>>16,c=((o*o>>>17)+o*n>>>15)+n*n,f=(0|(4294901760&i)*i)+(0|(65535&i)*i);a[t]=c^f}e[0]=0|a[0]+(a[7]<<16|a[7]>>>16)+(a[6]<<16|a[6]>>>16),e[1]=0|a[1]+(a[0]<<8|a[0]>>>24)+a[7],e[2]=0|a[2]+(a[1]<<16|a[1]>>>16)+(a[0]<<16|a[0]>>>16),e[3]=0|a[3]+(a[2]<<8|a[2]>>>24)+a[1],e[4]=0|a[4]+(a[3]<<16|a[3]>>>16)+(a[2]<<16|a[2]>>>16),e[5]=0|a[5]+(a[4]<<8|a[4]>>>24)+a[3],e[6]=0|a[6]+(a[5]<<16|a[5]>>>16)+(a[4]<<16|a[4]>>>16),e[7]=0|a[7]+(a[6]<<8|a[6]>>>24)+a[5]}var t=e,i=t.lib,o=i.StreamCipher,n=t.algo,c=[],s=[],a=[],f=n.RabbitLegacy=o.extend({_doReset:function(){var e=this._key.words,t=this.cfg.iv,i=this._X=[e[0],e[3]<<16|e[2]>>>16,e[1],e[0]<<16|e[3]>>>16,e[2],e[1]<<16|e[0]>>>16,e[3],e[2]<<16|e[1]>>>16],o=this._C=[e[2]<<16|e[2]>>>16,4294901760&e[0]|65535&e[1],e[3]<<16|e[3]>>>16,4294901760&e[1]|65535&e[2],e[0]<<16|e[0]>>>16,4294901760&e[2]|65535&e[3],e[1]<<16|e[1]>>>16,4294901760&e[3]|65535&e[0]];this._b=0;for(var n=0;4>n;n++)r.call(this);for(var n=0;8>n;n++)o[n]^=i[7&n+4];if(t){var c=t.words,s=c[0],a=c[1],f=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),u=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),h=f>>>16|4294901760&u,d=u<<16|65535&f;o[0]^=f,o[1]^=h,o[2]^=u,o[3]^=d,o[4]^=f,o[5]^=h,o[6]^=u,o[7]^=d;for(var n=0;4>n;n++)r.call(this)}},_doProcessBlock:function(e,t){var i=this._X;r.call(this),c[0]=i[0]^i[5]>>>16^i[3]<<16,c[1]=i[2]^i[7]>>>16^i[5]<<16,c[2]=i[4]^i[1]>>>16^i[7]<<16,c[3]=i[6]^i[3]>>>16^i[1]<<16;for(var o=0;4>o;o++)c[o]=16711935&(c[o]<<8|c[o]>>>24)|4278255360&(c[o]<<24|c[o]>>>8),e[t+o]^=c[o]},blockSize:4,ivSize:2});t.RabbitLegacy=o._createHelper(f)}(),e.RabbitLegacy});
},{"./cipher-core":4,"./core":5,"./enc-base64":6,"./evpkdf":8,"./md5":13}],26:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(){for(var e=this._X,r=this._C,t=0;8>t;t++)s[t]=r[t];r[0]=0|r[0]+1295307597+this._b,r[1]=0|r[1]+3545052371+(r[0]>>>0<s[0]>>>0?1:0),r[2]=0|r[2]+886263092+(r[1]>>>0<s[1]>>>0?1:0),r[3]=0|r[3]+1295307597+(r[2]>>>0<s[2]>>>0?1:0),r[4]=0|r[4]+3545052371+(r[3]>>>0<s[3]>>>0?1:0),r[5]=0|r[5]+886263092+(r[4]>>>0<s[4]>>>0?1:0),r[6]=0|r[6]+1295307597+(r[5]>>>0<s[5]>>>0?1:0),r[7]=0|r[7]+3545052371+(r[6]>>>0<s[6]>>>0?1:0),this._b=r[7]>>>0<s[7]>>>0?1:0;for(var t=0;8>t;t++){var i=e[t]+r[t],o=65535&i,n=i>>>16,c=((o*o>>>17)+o*n>>>15)+n*n,f=(0|(4294901760&i)*i)+(0|(65535&i)*i);a[t]=c^f}e[0]=0|a[0]+(a[7]<<16|a[7]>>>16)+(a[6]<<16|a[6]>>>16),e[1]=0|a[1]+(a[0]<<8|a[0]>>>24)+a[7],e[2]=0|a[2]+(a[1]<<16|a[1]>>>16)+(a[0]<<16|a[0]>>>16),e[3]=0|a[3]+(a[2]<<8|a[2]>>>24)+a[1],e[4]=0|a[4]+(a[3]<<16|a[3]>>>16)+(a[2]<<16|a[2]>>>16),e[5]=0|a[5]+(a[4]<<8|a[4]>>>24)+a[3],e[6]=0|a[6]+(a[5]<<16|a[5]>>>16)+(a[4]<<16|a[4]>>>16),e[7]=0|a[7]+(a[6]<<8|a[6]>>>24)+a[5]}var t=e,i=t.lib,o=i.StreamCipher,n=t.algo,c=[],s=[],a=[],f=n.Rabbit=o.extend({_doReset:function(){for(var e=this._key.words,t=this.cfg.iv,i=0;4>i;i++)e[i]=16711935&(e[i]<<8|e[i]>>>24)|4278255360&(e[i]<<24|e[i]>>>8);var o=this._X=[e[0],e[3]<<16|e[2]>>>16,e[1],e[0]<<16|e[3]>>>16,e[2],e[1]<<16|e[0]>>>16,e[3],e[2]<<16|e[1]>>>16],n=this._C=[e[2]<<16|e[2]>>>16,4294901760&e[0]|65535&e[1],e[3]<<16|e[3]>>>16,4294901760&e[1]|65535&e[2],e[0]<<16|e[0]>>>16,4294901760&e[2]|65535&e[3],e[1]<<16|e[1]>>>16,4294901760&e[3]|65535&e[0]];this._b=0;for(var i=0;4>i;i++)r.call(this);for(var i=0;8>i;i++)n[i]^=o[7&i+4];if(t){var c=t.words,s=c[0],a=c[1],f=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),u=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),h=f>>>16|4294901760&u,d=u<<16|65535&f;n[0]^=f,n[1]^=h,n[2]^=u,n[3]^=d,n[4]^=f,n[5]^=h,n[6]^=u,n[7]^=d;for(var i=0;4>i;i++)r.call(this)}},_doProcessBlock:function(e,t){var i=this._X;r.call(this),c[0]=i[0]^i[5]>>>16^i[3]<<16,c[1]=i[2]^i[7]>>>16^i[5]<<16,c[2]=i[4]^i[1]>>>16^i[7]<<16,c[3]=i[6]^i[3]>>>16^i[1]<<16;for(var o=0;4>o;o++)c[o]=16711935&(c[o]<<8|c[o]>>>24)|4278255360&(c[o]<<24|c[o]>>>8),e[t+o]^=c[o]},blockSize:4,ivSize:2});t.Rabbit=o._createHelper(f)}(),e.Rabbit});
},{"./cipher-core":4,"./core":5,"./enc-base64":6,"./evpkdf":8,"./md5":13}],27:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(){for(var e=this._S,r=this._i,t=this._j,i=0,o=0;4>o;o++){r=(r+1)%256,t=(t+e[r])%256;var n=e[r];e[r]=e[t],e[t]=n,i|=e[(e[r]+e[t])%256]<<24-8*o}return this._i=r,this._j=t,i}var t=e,i=t.lib,o=i.StreamCipher,n=t.algo,c=n.RC4=o.extend({_doReset:function(){for(var e=this._key,r=e.words,t=e.sigBytes,i=this._S=[],o=0;256>o;o++)i[o]=o;for(var o=0,n=0;256>o;o++){var c=o%t,s=255&r[c>>>2]>>>24-8*(c%4);n=(n+i[o]+s)%256;var a=i[o];i[o]=i[n],i[n]=a}this._i=this._j=0},_doProcessBlock:function(e,t){e[t]^=r.call(this)},keySize:8,ivSize:0});t.RC4=o._createHelper(c);var s=n.RC4Drop=c.extend({cfg:c.cfg.extend({drop:192}),_doReset:function(){c._doReset.call(this);for(var e=this.cfg.drop;e>0;e--)r.call(this)}});t.RC4Drop=o._createHelper(s)}(),e.RC4});
},{"./cipher-core":4,"./core":5,"./enc-base64":6,"./evpkdf":8,"./md5":13}],28:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(e,r,t){return e^r^t}function t(e,r,t){return e&r|~e&t}function n(e,r,t){return(e|~r)^t}function o(e,r,t){return e&t|r&~t}function i(e,r,t){return e^(r|~t)}function a(e,r){return e<<r|e>>>32-r}var s=e,c=s.lib,f=c.WordArray,u=c.Hasher,h=s.algo,d=f.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),p=f.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),l=f.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),y=f.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),m=f.create([0,1518500249,1859775393,2400959708,2840853838]),g=f.create([1352829926,1548603684,1836072691,2053994217,0]),v=h.RIPEMD160=u.extend({_doReset:function(){this._hash=f.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,s){for(var c=0;16>c;c++){var f=s+c,u=e[f];e[f]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}var h,v,x,w,_,q,H,S,b,A,B=this._hash.words,C=m.words,j=g.words,J=d.words,z=p.words,W=l.words,k=y.words;q=h=B[0],H=v=B[1],S=x=B[2],b=w=B[3],A=_=B[4];for(var M,c=0;80>c;c+=1)M=0|h+e[s+J[c]],M+=16>c?r(v,x,w)+C[0]:32>c?t(v,x,w)+C[1]:48>c?n(v,x,w)+C[2]:64>c?o(v,x,w)+C[3]:i(v,x,w)+C[4],M=0|M,M=a(M,W[c]),M=0|M+_,h=_,_=w,w=a(x,10),x=v,v=M,M=0|q+e[s+z[c]],M+=16>c?i(H,S,b)+j[0]:32>c?o(H,S,b)+j[1]:48>c?n(H,S,b)+j[2]:64>c?t(H,S,b)+j[3]:r(H,S,b)+j[4],M=0|M,M=a(M,k[c]),M=0|M+A,q=A,A=b,b=a(S,10),S=H,H=M;M=0|B[1]+x+b,B[1]=0|B[2]+w+A,B[2]=0|B[3]+_+q,B[3]=0|B[4]+h+H,B[4]=0|B[0]+v+S,B[0]=M},_doFinalize:function(){var e=this._data,r=e.words,t=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32,r[(n+64>>>9<<4)+14]=16711935&(t<<8|t>>>24)|4278255360&(t<<24|t>>>8),e.sigBytes=4*(r.length+1),this._process();for(var o=this._hash,i=o.words,a=0;5>a;a++){var s=i[a];i[a]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8)}return o},clone:function(){var e=u.clone.call(this);return e._hash=this._hash.clone(),e}});s.RIPEMD160=u._createHelper(v),s.HmacRIPEMD160=u._createHmacHelper(v)}(Math),e.RIPEMD160});
},{"./core":5}],29:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.WordArray,i=t.Hasher,o=r.algo,s=[],c=o.SHA1=i.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,r){for(var t=this._hash.words,n=t[0],i=t[1],o=t[2],c=t[3],a=t[4],f=0;80>f;f++){if(16>f)s[f]=0|e[r+f];else{var u=s[f-3]^s[f-8]^s[f-14]^s[f-16];s[f]=u<<1|u>>>31}var d=(n<<5|n>>>27)+a+s[f];d+=20>f?(i&o|~i&c)+1518500249:40>f?(i^o^c)+1859775393:60>f?(i&o|i&c|o&c)-1894007588:(i^o^c)-899497514,a=c,c=o,o=i<<30|i>>>2,i=n,n=d}t[0]=0|t[0]+n,t[1]=0|t[1]+i,t[2]=0|t[2]+o,t[3]=0|t[3]+c,t[4]=0|t[4]+a},_doFinalize:function(){var e=this._data,r=e.words,t=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[(n+64>>>9<<4)+14]=Math.floor(t/4294967296),r[(n+64>>>9<<4)+15]=t,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});r.SHA1=i._createHelper(c),r.HmacSHA1=i._createHmacHelper(c)}(),e.SHA1});
},{"./core":5}],30:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./sha256")):"function"==typeof define&&define.amd?define(["./core","./sha256"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.WordArray,i=r.algo,o=i.SHA256,s=i.SHA224=o.extend({_doReset:function(){this._hash=new n.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var e=o._doFinalize.call(this);return e.sigBytes-=4,e}});r.SHA224=o._createHelper(s),r.HmacSHA224=o._createHmacHelper(s)}(),e.SHA224});
},{"./core":5,"./sha256":31}],31:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(r){var t=e,n=t.lib,i=n.WordArray,o=n.Hasher,s=t.algo,c=[],a=[];(function(){function e(e){for(var t=r.sqrt(e),n=2;t>=n;n++)if(!(e%n))return!1;return!0}function t(e){return 0|4294967296*(e-(0|e))}for(var n=2,i=0;64>i;)e(n)&&(8>i&&(c[i]=t(r.pow(n,.5))),a[i]=t(r.pow(n,1/3)),i++),n++})();var f=[],u=s.SHA256=o.extend({_doReset:function(){this._hash=new i.init(c.slice(0))},_doProcessBlock:function(e,r){for(var t=this._hash.words,n=t[0],i=t[1],o=t[2],s=t[3],c=t[4],u=t[5],d=t[6],p=t[7],h=0;64>h;h++){if(16>h)f[h]=0|e[r+h];else{var y=f[h-15],l=(y<<25|y>>>7)^(y<<14|y>>>18)^y>>>3,m=f[h-2],x=(m<<15|m>>>17)^(m<<13|m>>>19)^m>>>10;f[h]=l+f[h-7]+x+f[h-16]}var q=c&u^~c&d,g=n&i^n&o^i&o,v=(n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22),_=(c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25),b=p+_+q+a[h]+f[h],S=v+g;p=d,d=u,u=c,c=0|s+b,s=o,o=i,i=n,n=0|b+S}t[0]=0|t[0]+n,t[1]=0|t[1]+i,t[2]=0|t[2]+o,t[3]=0|t[3]+s,t[4]=0|t[4]+c,t[5]=0|t[5]+u,t[6]=0|t[6]+d,t[7]=0|t[7]+p},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;return t[i>>>5]|=128<<24-i%32,t[(i+64>>>9<<4)+14]=r.floor(n/4294967296),t[(i+64>>>9<<4)+15]=n,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=o.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=o._createHelper(u),t.HmacSHA256=o._createHmacHelper(u)}(Math),e.SHA256});
},{"./core":5}],32:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./x64-core")):"function"==typeof define&&define.amd?define(["./core","./x64-core"],r):r(e.CryptoJS)})(this,function(e){return function(r){var t=e,i=t.lib,n=i.WordArray,o=i.Hasher,a=t.x64,s=a.Word,c=t.algo,f=[],u=[],h=[];(function(){for(var e=1,r=0,t=0;24>t;t++){f[e+5*r]=(t+1)*(t+2)/2%64;var i=r%5,n=(2*e+3*r)%5;e=i,r=n}for(var e=0;5>e;e++)for(var r=0;5>r;r++)u[e+5*r]=r+5*((2*e+3*r)%5);for(var o=1,a=0;24>a;a++){for(var c=0,d=0,p=0;7>p;p++){if(1&o){var l=(1<<p)-1;32>l?d^=1<<l:c^=1<<l-32}128&o?o=113^o<<1:o<<=1}h[a]=s.create(c,d)}})();var d=[];(function(){for(var e=0;25>e;e++)d[e]=s.create()})();var p=c.SHA3=o.extend({cfg:o.cfg.extend({outputLength:512}),_doReset:function(){for(var e=this._state=[],r=0;25>r;r++)e[r]=new s.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(e,r){for(var t=this._state,i=this.blockSize/2,n=0;i>n;n++){var o=e[r+2*n],a=e[r+2*n+1];o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),a=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8);var s=t[n];s.high^=a,s.low^=o}for(var c=0;24>c;c++){for(var p=0;5>p;p++){for(var l=0,y=0,m=0;5>m;m++){var s=t[p+5*m];l^=s.high,y^=s.low}var g=d[p];g.high=l,g.low=y}for(var p=0;5>p;p++)for(var v=d[(p+4)%5],x=d[(p+1)%5],w=x.high,_=x.low,l=v.high^(w<<1|_>>>31),y=v.low^(_<<1|w>>>31),m=0;5>m;m++){var s=t[p+5*m];s.high^=l,s.low^=y}for(var q=1;25>q;q++){var s=t[q],H=s.high,S=s.low,b=f[q];if(32>b)var l=H<<b|S>>>32-b,y=S<<b|H>>>32-b;else var l=S<<b-32|H>>>64-b,y=H<<b-32|S>>>64-b;var A=d[u[q]];A.high=l,A.low=y}var B=d[0],C=t[0];B.high=C.high,B.low=C.low;for(var p=0;5>p;p++)for(var m=0;5>m;m++){var q=p+5*m,s=t[q],j=d[q],J=d[(p+1)%5+5*m],z=d[(p+2)%5+5*m];s.high=j.high^~J.high&z.high,s.low=j.low^~J.low&z.low}var s=t[0],W=h[c];s.high^=W.high,s.low^=W.low}},_doFinalize:function(){var e=this._data,t=e.words;8*this._nDataBytes;var i=8*e.sigBytes,o=32*this.blockSize;t[i>>>5]|=1<<24-i%32,t[(r.ceil((i+1)/o)*o>>>5)-1]|=128,e.sigBytes=4*t.length,this._process();for(var a=this._state,s=this.cfg.outputLength/8,c=s/8,f=[],u=0;c>u;u++){var h=a[u],d=h.high,p=h.low;d=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8),p=16711935&(p<<8|p>>>24)|4278255360&(p<<24|p>>>8),f.push(p),f.push(d)}return new n.init(f,s)},clone:function(){for(var e=o.clone.call(this),r=e._state=this._state.slice(0),t=0;25>t;t++)r[t]=r[t].clone();return e}});t.SHA3=o._createHelper(p),t.HmacSHA3=o._createHmacHelper(p)}(Math),e.SHA3});
},{"./core":5,"./x64-core":36}],33:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./x64-core"),require("./sha512")):"function"==typeof define&&define.amd?define(["./core","./x64-core","./sha512"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.x64,n=t.Word,i=t.WordArray,o=r.algo,s=o.SHA512,a=o.SHA384=s.extend({_doReset:function(){this._hash=new i.init([new n.init(3418070365,3238371032),new n.init(1654270250,914150663),new n.init(2438529370,812702999),new n.init(355462360,4144912697),new n.init(1731405415,4290775857),new n.init(2394180231,1750603025),new n.init(3675008525,1694076839),new n.init(1203062813,3204075428)])},_doFinalize:function(){var e=s._doFinalize.call(this);return e.sigBytes-=16,e}});r.SHA384=s._createHelper(a),r.HmacSHA384=s._createHmacHelper(a)}(),e.SHA384});
},{"./core":5,"./sha512":34,"./x64-core":36}],34:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./x64-core")):"function"==typeof define&&define.amd?define(["./core","./x64-core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(){return s.create.apply(s,arguments)}var t=e,n=t.lib,i=n.Hasher,o=t.x64,s=o.Word,a=o.WordArray,c=t.algo,f=[r(1116352408,3609767458),r(1899447441,602891725),r(3049323471,3964484399),r(3921009573,2173295548),r(961987163,4081628472),r(1508970993,3053834265),r(2453635748,2937671579),r(2870763221,3664609560),r(3624381080,2734883394),r(310598401,1164996542),r(607225278,1323610764),r(1426881987,3590304994),r(1925078388,4068182383),r(2162078206,991336113),r(2614888103,633803317),r(3248222580,3479774868),r(3835390401,2666613458),r(4022224774,944711139),r(264347078,2341262773),r(604807628,2007800933),r(770255983,1495990901),r(1249150122,1856431235),r(1555081692,3175218132),r(1996064986,2198950837),r(2554220882,3999719339),r(2821834349,766784016),r(2952996808,2566594879),r(3210313671,3203337956),r(3336571891,1034457026),r(3584528711,2466948901),r(113926993,3758326383),r(338241895,168717936),r(666307205,1188179964),r(773529912,1546045734),r(1294757372,1522805485),r(1396182291,2643833823),r(1695183700,2343527390),r(1986661051,1014477480),r(2177026350,1206759142),r(2456956037,344077627),r(2730485921,1290863460),r(2820302411,3158454273),r(3259730800,3505952657),r(3345764771,106217008),r(3516065817,3606008344),r(3600352804,1432725776),r(4094571909,1467031594),r(275423344,851169720),r(430227734,3100823752),r(506948616,1363258195),r(659060556,3750685593),r(883997877,3785050280),r(958139571,3318307427),r(1322822218,3812723403),r(1537002063,2003034995),r(1747873779,3602036899),r(1955562222,1575990012),r(2024104815,1125592928),r(2227730452,2716904306),r(2361852424,442776044),r(2428436474,593698344),r(2756734187,3733110249),r(3204031479,2999351573),r(3329325298,3815920427),r(3391569614,3928383900),r(3515267271,566280711),r(3940187606,3454069534),r(4118630271,4000239992),r(116418474,1914138554),r(174292421,2731055270),r(289380356,3203993006),r(460393269,320620315),r(685471733,587496836),r(852142971,1086792851),r(1017036298,365543100),r(1126000580,2618297676),r(1288033470,3409855158),r(1501505948,4234509866),r(1607167915,987167468),r(1816402316,1246189591)],u=[];(function(){for(var e=0;80>e;e++)u[e]=r()})();var h=c.SHA512=i.extend({_doReset:function(){this._hash=new a.init([new s.init(1779033703,4089235720),new s.init(3144134277,2227873595),new s.init(1013904242,4271175723),new s.init(2773480762,1595750129),new s.init(1359893119,2917565137),new s.init(2600822924,725511199),new s.init(528734635,4215389547),new s.init(1541459225,327033209)])},_doProcessBlock:function(e,r){for(var t=this._hash.words,n=t[0],i=t[1],o=t[2],s=t[3],a=t[4],c=t[5],h=t[6],d=t[7],p=n.high,l=n.low,y=i.high,m=i.low,x=o.high,g=o.low,v=s.high,q=s.low,_=a.high,w=a.low,b=c.high,S=c.low,H=h.high,A=h.low,B=d.high,C=d.low,j=p,J=l,z=y,U=m,k=x,W=g,M=v,D=q,P=_,F=w,I=b,R=S,O=H,L=A,E=B,X=C,$=0;80>$;$++){var T=u[$];if(16>$)var G=T.high=0|e[r+2*$],K=T.low=0|e[r+2*$+1];else{var N=u[$-15],Q=N.high,V=N.low,Y=(Q>>>1|V<<31)^(Q>>>8|V<<24)^Q>>>7,Z=(V>>>1|Q<<31)^(V>>>8|Q<<24)^(V>>>7|Q<<25),er=u[$-2],rr=er.high,tr=er.low,nr=(rr>>>19|tr<<13)^(rr<<3|tr>>>29)^rr>>>6,ir=(tr>>>19|rr<<13)^(tr<<3|rr>>>29)^(tr>>>6|rr<<26),or=u[$-7],sr=or.high,ar=or.low,cr=u[$-16],fr=cr.high,ur=cr.low,K=Z+ar,G=Y+sr+(Z>>>0>K>>>0?1:0),K=K+ir,G=G+nr+(ir>>>0>K>>>0?1:0),K=K+ur,G=G+fr+(ur>>>0>K>>>0?1:0);T.high=G,T.low=K}var hr=P&I^~P&O,dr=F&R^~F&L,pr=j&z^j&k^z&k,lr=J&U^J&W^U&W,yr=(j>>>28|J<<4)^(j<<30|J>>>2)^(j<<25|J>>>7),mr=(J>>>28|j<<4)^(J<<30|j>>>2)^(J<<25|j>>>7),xr=(P>>>14|F<<18)^(P>>>18|F<<14)^(P<<23|F>>>9),gr=(F>>>14|P<<18)^(F>>>18|P<<14)^(F<<23|P>>>9),vr=f[$],qr=vr.high,_r=vr.low,wr=X+gr,br=E+xr+(X>>>0>wr>>>0?1:0),wr=wr+dr,br=br+hr+(dr>>>0>wr>>>0?1:0),wr=wr+_r,br=br+qr+(_r>>>0>wr>>>0?1:0),wr=wr+K,br=br+G+(K>>>0>wr>>>0?1:0),Sr=mr+lr,Hr=yr+pr+(mr>>>0>Sr>>>0?1:0);E=O,X=L,O=I,L=R,I=P,R=F,F=0|D+wr,P=0|M+br+(D>>>0>F>>>0?1:0),M=k,D=W,k=z,W=U,z=j,U=J,J=0|wr+Sr,j=0|br+Hr+(wr>>>0>J>>>0?1:0)}l=n.low=l+J,n.high=p+j+(J>>>0>l>>>0?1:0),m=i.low=m+U,i.high=y+z+(U>>>0>m>>>0?1:0),g=o.low=g+W,o.high=x+k+(W>>>0>g>>>0?1:0),q=s.low=q+D,s.high=v+M+(D>>>0>q>>>0?1:0),w=a.low=w+F,a.high=_+P+(F>>>0>w>>>0?1:0),S=c.low=S+R,c.high=b+I+(R>>>0>S>>>0?1:0),A=h.low=A+L,h.high=H+O+(L>>>0>A>>>0?1:0),C=d.low=C+X,d.high=B+E+(X>>>0>C>>>0?1:0)},_doFinalize:function(){var e=this._data,r=e.words,t=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32,r[(n+128>>>10<<5)+30]=Math.floor(t/4294967296),r[(n+128>>>10<<5)+31]=t,e.sigBytes=4*r.length,this._process();var i=this._hash.toX32();return i},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e},blockSize:32});t.SHA512=i._createHelper(h),t.HmacSHA512=i._createHmacHelper(h)}(),e.SHA512});
},{"./core":5,"./x64-core":36}],35:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(e,r){var t=(this._lBlock>>>e^this._rBlock)&r;this._rBlock^=t,this._lBlock^=t<<e}function t(e,r){var t=(this._rBlock>>>e^this._lBlock)&r;this._lBlock^=t,this._rBlock^=t<<e}var i=e,o=i.lib,n=o.WordArray,c=o.BlockCipher,s=i.algo,a=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],f=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],u=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],h=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],p=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],d=s.DES=c.extend({_doReset:function(){for(var e=this._key,r=e.words,t=[],i=0;56>i;i++){var o=a[i]-1;t[i]=1&r[o>>>5]>>>31-o%32}for(var n=this._subKeys=[],c=0;16>c;c++){for(var s=n[c]=[],h=u[c],i=0;24>i;i++)s[0|i/6]|=t[(f[i]-1+h)%28]<<31-i%6,s[4+(0|i/6)]|=t[28+(f[i+24]-1+h)%28]<<31-i%6;s[0]=s[0]<<1|s[0]>>>31;for(var i=1;7>i;i++)s[i]=s[i]>>>4*(i-1)+3;s[7]=s[7]<<5|s[7]>>>27}for(var p=this._invSubKeys=[],i=0;16>i;i++)p[i]=n[15-i]},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._subKeys)},decryptBlock:function(e,r){this._doCryptBlock(e,r,this._invSubKeys)},_doCryptBlock:function(e,i,o){this._lBlock=e[i],this._rBlock=e[i+1],r.call(this,4,252645135),r.call(this,16,65535),t.call(this,2,858993459),t.call(this,8,16711935),r.call(this,1,1431655765);for(var n=0;16>n;n++){for(var c=o[n],s=this._lBlock,a=this._rBlock,f=0,u=0;8>u;u++)f|=h[u][((a^c[u])&p[u])>>>0];this._lBlock=a,this._rBlock=s^f}var d=this._lBlock;this._lBlock=this._rBlock,this._rBlock=d,r.call(this,1,1431655765),t.call(this,8,16711935),t.call(this,2,858993459),r.call(this,16,65535),r.call(this,4,252645135),e[i]=this._lBlock,e[i+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});i.DES=c._createHelper(d);var l=s.TripleDES=c.extend({_doReset:function(){var e=this._key,r=e.words;this._des1=d.createEncryptor(n.create(r.slice(0,2))),this._des2=d.createEncryptor(n.create(r.slice(2,4))),this._des3=d.createEncryptor(n.create(r.slice(4,6)))},encryptBlock:function(e,r){this._des1.encryptBlock(e,r),this._des2.decryptBlock(e,r),this._des3.encryptBlock(e,r)},decryptBlock:function(e,r){this._des3.decryptBlock(e,r),this._des2.encryptBlock(e,r),this._des1.decryptBlock(e,r)},keySize:6,ivSize:2,blockSize:2});i.TripleDES=c._createHelper(l)}(),e.TripleDES});
},{"./cipher-core":4,"./core":5,"./enc-base64":6,"./evpkdf":8,"./md5":13}],36:[function(require,module,exports){
(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(r){var t=e,i=t.lib,n=i.Base,o=i.WordArray,c=t.x64={};c.Word=n.extend({init:function(e,r){this.high=e,this.low=r}}),c.WordArray=n.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=t!=r?t:8*e.length},toX32:function(){for(var e=this.words,r=e.length,t=[],i=0;r>i;i++){var n=e[i];t.push(n.high),t.push(n.low)}return o.create(t,this.sigBytes)},clone:function(){for(var e=n.clone.call(this),r=e.words=this.words.slice(0),t=r.length,i=0;t>i;i++)r[i]=r[i].clone();return e}})}(),e});
},{"./core":5}],37:[function(require,module,exports){
//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value == null ? _.identity : value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],38:[function(require,module,exports){
/* Zepto v1.0 - polyfill zepto detect event ajax form fx - zeptojs.com/license */

;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()





var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    tagSelectorRE = /^[\w-]+$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'

    var nodes, dom, container = containers[name]
    container.innerHTML = '' + html
    dom = $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }
    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes. If a plain object is given, duplicate it.
      else if (isObject(selector))
        dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (isDocument(element) && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2 && typeof property == 'string')
        return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(){
      if (!this.length) return
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, el = this[0],
        Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
        isDocument(el) ? el.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// @@ original loader
// window.Zepto = Zepto
// '$' in window || (window.$ = Zepto)
// @@ modified by jiyinyiyong
module.exports.$ = Zepto;
module.exports.Zepto = Zepto;
// @@ modifications end


;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
    os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)





;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (handler.e == 'focus' || handler.e == 'blur') ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || type
  }

  function add(element, events, fn, selector, getDelegate, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = getDelegate && getDelegate(fn, event)
      var callback  = handler.del || fn
      handler.proxy = function (e) {
        var result = callback.apply(element, [e].concat(e.data))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      })
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (typeof type != 'string') props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    event.isDefaultPrevented = function(){ return this.defaultPrevented }
    return event
  }

})(Zepto)





;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    if (!('type' in options)) return $.ajax(options)

    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      cleanup = function() {
        clearTimeout(abortTimeout)
        $(script).remove()
        delete window[callbackName]
      },
      abort = function(type){
        cleanup()
        // In case of manual abort or timeout, keep an empty function as callback
        // so that the SCRIPT tag that eventually loads won't result in an error.
        if (!type || type == 'timeout') window[callbackName] = empty
        ajaxError(null, type || 'abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return false
    }

    window[callbackName] = function(data){
      cleanup()
      ajaxSuccess(data, xhr, options)
    }

    script.onerror = function() { abort('error') }

    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true,
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)





;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)





;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming,
    animationName, animationDuration, animationTiming,
    cssReset = {}

  function dasherize(str) { return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) }
  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd

    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      }
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

},{}],39:[function(require,module,exports){
(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto,
	    _ = require('underscore')._,
	    Telepathy = require('telepathy'),
	    telepathy = new Telepathy();

	// todo: show dialog prompt for default username and master password

	// google.com: u25YhZz44m
	$('#domain').on('keydown', _.debounce(function() {
		$('#password').text(telepathy.password({
			alphabet: $('#lax').attr('checked') ?
			            Telepathy.alphabet.base62 :
			            Telepathy.alphabet.base94,
			domain: this.value
		}));
	}));

	$('.modal-close').on('click', function() {
		$(this).parents('.modal').removeClass('open');
	});

	$('.modal-bg').on('click', function(event) {
		if ($('.modal.open').length && !$(event.target).parents('.modal').length) {
			event.preventDefault();
			event.stopPropagation();
			$('.modal.open').removeClass('open');
		}
	});

	$('#open-settings').on('click', function(event) {
		if (!$('.modal.open').length) {
			event.preventDefault();
			event.stopPropagation();
			$('#settings').addClass('open');
		}
	});

	$(document).bind('touchmove', function(event) {
		event.preventDefault();
		return false;
	});

	var UI = {
		settings: {
		},

		save: function() {
			localStorage.telepathyWeb = JSON.stringify({
				settings: this.settings
			});
		},

		load: function() {
			var data = JSON.parse(localStorage.telepathyWeb),
			    that = this;

			if (!data) return;

			if (typeof data.settings != 'object') {
				Object.keys(data.settings).forEach(function(key) {
					that.settings[key] = data.settings[key];
				});
			}
		}
	};

	UI.load();
})();

},{"telepathy":1,"underscore":37,"zepto-browserify":38}]},{},[39])
;