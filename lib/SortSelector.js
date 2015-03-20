/*
 * Copyright (c) 2015 Kazuki Oda.
 * 
 * This file is part of JsGap.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 */
var JsGap = JsGap || {};
/**
 * ソートして一番評価値の高いものを順に選別するクラス。
 */ 
JsGap.SortSelector = (function(){
    /**
     *  ランダムの整数を返す
     */
    var nextInt = function(num){
      return Math.floor(Math.random() * (num ) );
    };
    /**
     *  カウンタクラス。
     */
    function Counter(initialCount){
    	if(typeof initialCount === 'undefined') {
    		initialCount = 0;
    	}
    	this.count = initialCount;
    	this.increment = function(howMany){ 
          if(typeof howMany === 'undefined') {
            howMany = 1;
          }
          this.count += howMany; 
    	};
    	this.getCount = function(){ return this.count; };
    	this.reset = function(){ this.count = 0; };
    	return this;
    };
    /**
     * コンストラクタ。
     */
    function SortSelector(){
      this.population = {};
      this.totalInstances = 0;
      this.count = 0;
    };

    /**
     * 染色体情報を追加する。
     * @param chromosome 染色体
     * @param fitness 染色体の適合性
     */
    SortSelector.prototype.add = function( chromosome , fitness ){
      var hash = chromosome.getHash();
      if(typeof this.population[hash] !== 'undefined'){
        this.population[hash].counter.increment(fitness);
      } else {
        this.population[hash] = {
          key :  chromosome, 
          counter :  new Counter(fitness)
        };
      }
      this.totalInstances += fitness;
    };

    /**
     * 染色体情報リストを取得する。
     * @param howMany 取得する数
     * @return 染色体情報(Chromosome[])
     */
     SortSelector.prototype.select = function(howMany){
       var keys = [];
       for(var i in this.population) {
          keys.push( this.population[i].counter.getCount() );
       }
       //console.log(keys.toString());
       keys.sort(function(a , b) {
          if( a < b)  return 1;
          if( a > b) return -1;
          return 0;
       });
       var _keys = [];
       for(var i in keys){
         _keys.push(keys[i]);
         if(_keys.length >= howMany){
           break;
         }
       }
       _keys.sort(function(a , b) {
          if( a > b)  return 1;
          if( a < b) return -1;
          return 0;
       });
       console.log(_keys.toString());
       var selections = [];
       var ready = [];
       for(var _c = 0; _c < _keys.length; _c++){
         var test = _keys[_c];
         for(var i in this.population){
           if(test == this.population[i].counter.getCount()){
             var __test = true;
             for(var __c in ready){
               if(ready[__c] == i) __test = false;
             }
             if(__test){
               ready.push(i);
               selections.push(this.population[i].key);
               break;
             }
           }
         }
       }
       return selections;
     }
    
    /**
     * 染色体情報のプールをからにする
     */
    SortSelector.prototype.empty = function(){
      this.population = [];
      this.totalInstances = 0;
    };

    return SortSelector;
})();
