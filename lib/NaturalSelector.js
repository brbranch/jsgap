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
 * 染色体情報を取捨選択する適者生存クラス（インタフェース）
 */
JsGap.NaturalSelector = function() {
};
/**
 * 染色体情報を追加する。
 * @param chromosome 染色体
 * @param fitness 染色体の適合性
 */
JsGap.NaturalSelector.prototype.add = function(chromosome , fitness){};

/**
 * 染色体情報リストを取得する。
 * @param howMany 取得する数
 * @return 染色体情報(Chromosome[])
 */
JsGap.NaturalSelector.prototype.select = function(howMany){ };
/**
 * 染色体情報を空にする。
 */
JsGap.NaturalSelector.prototype.empty = function(){ };
