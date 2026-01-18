
import React from 'react';
import { CategoryOption } from './types';

export const CATEGORIES: CategoryOption[] = [
  { 
    value: 'Gym', 
    subcategories: ['功能性訓練', '重量訓練', '帶氧運動', 'HIIT', '伸展'], 
    color: 'bg-blue-500',
    icon: '💪'
  },
  { 
    value: '羽毛球', 
    subcategories: ['友誼賽', '技術練習', '正式比賽', '單打', '雙打'], 
    color: 'bg-green-500',
    icon: '🏸'
  },
  { 
    value: '排球', 
    subcategories: ['打比賽', '隊訓', '街場', '技術訓練'], 
    color: 'bg-orange-500',
    icon: '🏐'
  },
  { 
    value: '跑步', 
    subcategories: ['慢跑', '長跑', '衝刺練習', '馬拉松訓練'], 
    color: 'bg-red-500',
    icon: '🏃'
  },
  { 
    value: '游泳', 
    subcategories: ['自由式', '蛙式', '蝶式', '背泳'], 
    color: 'bg-cyan-500',
    icon: '🏊'
  },
  { 
    value: '瑜伽', 
    subcategories: ['哈達瑜伽', '流瑜伽', '陰瑜伽', '普拉提'], 
    color: 'bg-purple-500',
    icon: '🧘'
  },
  { 
    value: '其他', 
    subcategories: ['自定義項目'], 
    color: 'bg-gray-500',
    icon: '✨'
  },
];

export const STORAGE_KEY = 'fittrack_logs_v1';
