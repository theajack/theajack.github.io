---
title: Element-UI Select 下拉框 根据汉字拼音过滤选择选项（使用filter-method，filterable属性）
tags: element_ui,web
categories: 教程
top_img: 
date: 2022-07-18
updated:
cover: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2017-11-01%2F59f96b02db0e7.jpg%3Fdown&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660695697&t=627e4508316e2419f63b0978b6343ab2
keywords: tackchen
id: cnchar_element
---
​
在使用 Element-UI Select 组件时，遇到一个需求是根据汉字或汉字拼音来过滤选项，记录一下解决方案。

这里需要使用 Element-UI Select 组件的 filter-method 和 filterable属性。

另外需要使用 js 拼音库 CnChar ，这个库主要就是做汉字转拼音和汉字笔画数的。使用 npm i cnchar 就可以安装使用啦，详细的使用 CnChar 文档里有介绍。 

需求大概是这样的：汉字匹配就不用多说了，拼音匹配有个要求，就是只能从某个汉字的拼音开始匹配，不能截断，比如说：双皮奶 不能被 huangpinai 匹配，但是可以被 pinai 匹配。

实现思路就是在 filter-method 中使用数组的filter方法对源数据进行过滤就可以，过滤方法使用 [CnChar](https://github.com/theajack/cnchar) 提供的 .spell方法可以获取拼音数组。

其实也比较简单，我就直接上代码啦，注释写的比较完整，就不过多解释啦，有不理解的地方可以留言哈：

```html
<template>
    <div>
        <el-select v-model="value" :filter-method="filter" filterable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
    </div>
</template>
<script>
    import cnchar from "cnchar";
    export default {
        data() {
            return {
                copy: [],
                options: [
                    {
                        value: "选项1",
                        label: "黄金糕"
                    },
                    {
                        value: "选项2",
                        label: "双皮奶"
                    },
                    {
                        value: "选项3",
                        label: "先生"
                    },
                    {
                        value: "选项4",
                        label: "西安城"
                    },
                    {
                        value: "选项5",
                        label: "松下电器"
                    },
                    {
                        value: "选项6",
                        label: "学习成果"
                    }
                ],
                value: ""
            };
        },
        mounted() {
            //保留数据源
            this.copy = Object.assign(this.options);
        },
        methods: {
            filter(v) {
                //对绑定数据赋值
                this.options = this.copy.filter((item) => {
                    //如果直接包含输入值直接返回true
                    if (item.label.indexOf(v) !== -1) return true;

                    //将label拆散成小写拼音数组
                    let arr = item.label.spell('low', 'array');
                    //拼接成完整label的拼音
                    let spell = arr.join('');
                    //lengths 是label完整拼音 中每个汉字第一个拼音字母的index值的数组
                    let lengths = [0];
                    for (var i = 0; i < arr.length - 1; i++) {
                        lengths.push(lengths[i] + arr[i].length);
                    };
                    //判断label完整拼音 中 输入值的 index 是不是等于某个汉字第一个拼音字母的index值
                    return lengths.indexOf(spell.indexOf(v)) !== -1;
                })
            }
        }
    };
</script>
```