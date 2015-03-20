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
 * 染色体クラス。
 */
JsGap.Chromosome = (function(){
  /** デフォルトの突然変異率 */
  var DEFAULT_MUTATION_RATE = 1000;
  /** 表示番号 */
  var INCREMENT = 0;
  /** 乱数の数値を得る */ 
  var nextInt = function(num){
    var ran = Math.random() * (num );
    return Math.floor(ran);
  };
  /** 
   * コンストラクタ。
   * @param initialGenes 遺伝子クラス
   * @param chromosomeLength 染色体の数
   * @param desiredMutationRate 突然変異の確率
   */
  function Chromosome( initialGenes , chromosomeLength, desiredMutationRate ){
    this.mutationRate = DEFAULT_MUTATION_RATE;
    this.genes = null;
    this.numberOfGenes;
    this.hash = "chromosome" + (new Date()).getTime() + "_" + INCREMENT++ + "_" + nextInt(10000);
    if( typeof initialGenes === 'undefined' ){
      throw new TypeError("Genes cannot be null.");
    }
    if( typeof chromosomeLength !== 'number' || chromosomeLength <= 0){
      throw new TypeError("Chromosomes must have a positive length.");
    }
    this.genes = initialGenes;
    this.numberOfGenes = chromosomeLength;
    if( typeof desiredMutationRate === 'number' ){
      this.mutationRate = desiredMutationRate;
    }
    return this;
  }

  /**
   * 遺伝子の数を得る。
   * @return 遺伝子の数(int)
   */
  Chromosome.prototype.size = function(){
    return this.numberOfGenes;
  }

  /**
   * 同じ染色体クラスを返す。
   * @return 染色体クラス
   */
  Chromosome.prototype.reproduce = function(){
    var bitset = new JsGap.BitSet();
    for(var i = 0; i < this.numberOfGenes; i++){
      if(this.genes.get(i)) bitset.set(i);
    }
    return new Chromosome(bitset , this.numberOfGenes, this.mutationRate);
  };
  
  /**
   * 固有のハッシュを返す
   * @return ハッシュ文字列
   */
  Chromosome.prototype.getHash = function(){
	  return this.hash;
  };

  /**
   * 交配を行う。
   * @param mate 交配する相手(Chromosomeクラス)
   */
  Chromosome.prototype.crossover = function(mate){
    if(!mate instanceof Chromosome){
      throw new TypeError("mate must be Chromosome."); 
    }
    var locus = nextInt(this.numberOfGenes);
    var currentAllele = false;
    for( var i = locus; i < this.numberOfGenes; i++ ){
      currentAllele = this.genes.get(i);
      if(mate.genes.get(i)){
        this.genes.set(i);
      } else {
        this.genes.clear(i);
      }

      if( currentAllele ){
        mate.genes.set(i);
      } else {
        mate.genes.clear(i);
      };
    };
  };

  /**
   * 突然変異を起こす。
   */
  Chromosome.prototype.mutate = function(){
    for( var i = 0 ; i < this.numberOfGenes; i++ ){
      if( nextInt(this.mutationRate) ==  0 ){
        if( this.genes.get(i) ) {
          this.genes.clear(i);
        } else {
          this.genes.set(i);
        };
      };
    };
  };

  /**
   * 対立遺伝子を取得する。
   * @param locus 遺伝子の位置
   * @return 遺伝子(true|false)
   */
  Chromosome.prototype.getAllele = function( locus ){
    return this.genes.get(locus);
  };
  
  /**
   * 文字列を返す。
   * @return 文字列
   */
  Chromosome.prototype.toString = function(){
    return this.genes.toString();
  };

  /**
   * (static) ランダムの染色体クラスを生成する。
   * @param size 遺伝子のサイズ
   * @param mutationRate 突然変異を起こす確率
   * @return 染色体クラス
   */
  Chromosome.randomInitialChromosome = function(size , mutationRate) {
    if( typeof mutationRate === 'undefined' ) {
      mutationRate = DEFAULT_MUTATION_RATE;
    }
    var genes = new JsGap.BitSet();
    for( var i = 0; i < size; i++ ) {
      if( nextInt( 2 ) == 0 ) {
        genes.set(i);
      } else { 
        genes.clear(i);
      };
    }

    return new Chromosome( genes , size , mutationRate);
  };
    
    return Chromosome;
})();


/**
 * 偽BitSetクラス
 * (JavaのBitSetのget,set,clear等と同じ結果を返すだけのクラス）
 */
JsGap.BitSet = (function() {
  /**
   * コンストラクタ
   */
  function BitSet() {
    this.store = {};
  }

  /**
   * セット位置を1にする。
   * @param pos BitSetの位置
   */
  BitSet.prototype.set = function(pos) {
     this.store[pos] = 1;
  };

  /**
   * セット位置を0にする。
   * @param pos BitSetの位置
   */
  BitSet.prototype.clear = function(pos) {
    return this.store[pos] = 0;
  };

  /**
   * セット位置の値を得る
   * @param pos BitSetの位置
   * @return 1の場合true
   */
  BitSet.prototype.get = function(pos) {
    var i = (typeof this.store[pos] != 'undefined' && this.store[pos] == 1);
    return i;
  };

  /**
   * 文字列を返す
   * @return 文字列
   */
  BitSet.prototype.toString = function() {
    var pos, result;
    result = [];
    for (pos in this.store) { 
      if (this.get(pos)) {
        result.push(pos);
      }
    }
    return "{" + (result.join(",")) + "}";
  };
  return BitSet;
})();

