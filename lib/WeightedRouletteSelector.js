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
 * ルーレットで進化ゲノムを取得するセレクタクラス。
 */ 
JsGap.WeightedRouletteSelector = (function(){
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
    function WeightedRouletteSelector(){
      this.population = {};
      this.totalInstances = 0;
      this.count = 0;
    };

    /**
     * 染色体情報を追加する。
     * @param chromosome 染色体
     * @param fitness 染色体の適合性
     */
    WeightedRouletteSelector.prototype.add = function( chromosome , fitness ){
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
    WeightedRouletteSelector.prototype.select = function( howMany ){
      var selections = [];
      var selectedIndices = [];
      var ii = 0;
      for(var i = 0; i < howMany; i++){
        selectedIndices.push(nextInt(this.totalInstances));
      }
      selectedIndices.sort(function(a ,b){
        if( a > b ) return 1;
        if( a < b ) return -1;
        return 0;
      });

      var currentIndex = 0;
      var currentCount = 0;
      var currentChromosome;

      for(var i in this.population){
        currentChromosome = this.population[i].key;
        currentCount += this.population[i].counter.getCount(); 
        while( currentIndex < selectedIndices.length &&
            currentCount >= selectedIndices[currentIndex] ){
          selections.push(currentChromosome);
          currentIndex++;
        }
      }
      return selections;
    };
    
    /**
     * 染色体情報のプールをからにする
     */
    WeightedRouletteSelector.prototype.empty = function(){
      this.population = [];
      this.totalInstances = 0;
    };

    return WeightedRouletteSelector;
})();
