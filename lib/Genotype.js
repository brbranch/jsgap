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
 *  遺伝クラス。
 */
JsGap.Genotype = (function(){
  /**
   * コンストラクタ。
   * @param initialChromosomes 初期化染色体情報(Chromosome)
   * @param fitnessFunc 進化評価クラス
   * @param selector 適者生存クラス
   * @throws fitnessFuncのクラス内にevaluateメソッドがない場合
   */
  function Genotype(initialChromosomes ,  fitnessFunc ,  selector){
     this.chromosomes = initialChromosomes;
     this.objectiveFunction = fitnessFunc;
     this.populationSelector = selector;
     this.workingPool = [];
     if(this.objectiveFunction.evaluate == undefined){
       throw new TypeError("fitnessFunc.evaluate was not found.");
     }
  };

  /**
   * 染色体情報を得る
   * @return 染色体情報
   */
  Genotype.prototype.getChromosomes = function(){
	  return this.chromosomes;
  };
  
  /**
   * 一番適合性の高い遺伝子情報を得る。
   * @return 遺伝子情報
   */
  Genotype.prototype.getFittestChromosome = function(){
	 if(this.chromosomes.length == 0){
		 return null;
	 } 
	 var fittestChromosome = this.chromosomes[0];
	 var fittestValue = this.objectiveFunction.evaluate(fittestChromosome);
	 for( var i = 1; i < this.chromosomes.length; i++){
		 var _chromosome = this.chromosomes[i];
		 var fitnessValue = this.objectiveFunction.evaluate(_chromosome);
		 if( fitnessValue >  fittestValue ){
			 fittestChromosome = _chromosome;
			 fittestValue = fitnessValue;
		 }
	 } 
	 return fittestChromosome;
  };
  
  /**
   * ランダムな数値を得る
   */
  var nextInt = function(num){
    return Math.floor(Math.random() * num );
  };
  
  /**
   * 進化を行う。
   */
  Genotype.prototype.evolve = function(){
	 this.workingPool = [];
	 for( var i = 0; i < this.chromosomes.length; i++){
		 this.workingPool.push(this.chromosomes[i].reproduce());
		 var firstMate = this.chromosomes[nextInt(this.chromosomes.length)];
		 var secondMate = this.chromosomes[nextInt(this.chromosomes.length)];

		 firstMate.crossover( secondMate );
		 
		 this.workingPool.push(firstMate);
		 this.workingPool.push(secondMate);
	 }
	 
	 for( var i = 0; i < this.workingPool.length; i++) {
		 var currentChromosome = this.workingPool[i];
		 currentChromosome.mutate();
                 var nextEvaluate = this.objectiveFunction.evaluate(currentChromosome);
		 this.populationSelector.add( currentChromosome , nextEvaluate);
	 }
	 
	 this.chromosomes = this.populationSelector.select(
			 this.chromosomes.length);
  };
	
  /**
   * 文字列を得る。
   * @return 文字列
   */
  Genotype.prototype.toString = function(){
	 var buffer = ""; 
	 for( var i = 0; i < this.chromosomes.length; i++){
		 var _chromosome = this.chromosomes[i];
		 buffer += _chromosome.toString();
		 buffer += " [";
		 buffer +=  this.objectiveFunction.evaluate( _chromosome );
		 buffer += "]";
		 buffer += "\n";
	 }
	 return buffer;
  };
  
  /**
   * ランダムな数値の遺伝情報を作成する
   */
  Genotype.randomInitialGenotype = function(populationSize , chromosomeSize , mutationRate , fitnessFunc ,  selector ){
	 var chromosomes = [];
	 for(var i = 0; i < populationSize; i++){
		 chromosomes.push(JsGap.Chromosome.randomInitialChromosome(chromosomeSize, mutationRate));
	 }
	 return new Genotype(chromosomes, fitnessFunc  , selector );
  };
  return Genotype;
})();
