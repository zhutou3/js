// ==UserScript==
// @name         Bangumi动画搜索 跳转AniDB/MyAnimeList/ANN/TMDB和动漫花园等BT站/在线播放站一键跳转 2020年6月13日
// @namespace    waecy
// @version      1.7.3.6
// @description  自动获取搜索页/动漫日文名 跳转AniDB/MyAnimeList/ANN/TMDB /BT站/在线播放站一键跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/405283
// @author       waecy
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @include      *://bangumi.tv/*
// @include      *://bgm.tv/*
// @include      *://chii.in/*
// @icon         https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @icon64       https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==
/*
  前提:
  本人之所以写这个脚本的初衷,是因为每次补番并收藏时,有习惯查找动漫的日文名/英文名/中文名,其中英文名最为重要
  只要有了英文名,无论去动漫花园,还是国内外各大BT/论坛等查找资源都会很方便,因为多数人发布资源,都喜欢加英文名
  以前为了收集英文名,每次都得同时打开几个网站,Ctrl + C,然后Ctrl + V粘贴,步骤比较繁琐,这才下定决心写个脚本
  方便自己,快速切换,不用每次重复输入动漫名...如果大家也需要方便跳转的,我写的这个脚本能满足你们的需求
 */
$(function() {
    console.time('========== 这里启动 ===============');

    function $initFn() {
        // 循环遍历li,添加跳转a标签
        $('.item.clearit .inner').each(function(index, ele) {
            // 获取番/日文名
            var animeNames = $(ele).find('.grey').html();
            // 获取番/中文名
            var scAnimeNames = $(ele).find('h3 a').html();
            // 获取当前时间
            var selfDate = $(ele).find('.info.tip').html();
            // 保存日期对象
            var animeDateObj = {};
            // 判断是否当前页面时标签页,是否包含/anime/
            if (window.location.pathname.indexOf('/anime/') != -1) {
                // 声明遍历保存日期索引
                var getDataIndex = '';
                // 判断是否有总集数,有的话进入判断
                if (selfDate.indexOf(' / ') != -1 && selfDate.indexOf('话') != -1) {
                    // 获取新的
                    animeDateObj = selfDate.substr(selfDate.indexOf(' / ') + 3, selfDate.length - 1).replace(/\s+/g, "");
                }
            } else {
                animeDateObj = selfDate.replace(/\s+/g, "");
            }
            // 保存日期对象
            animeDateObj = getListDate(animeDateObj, true);
            // 保存年
            var animeYear = animeDateObj.year;
            // 保存月
            var animeMonth = animeDateObj.month;
            // 保存日
            var animeDay = animeDateObj.day;
            // 如果搜索页没有第二个日文名,默认用第一个搜索
            if (!animeNames) {
                animeNames = scAnimeNames;
            }
            // 添加列表
            $addUrlEle(ele, animeNames, scAnimeNames, animeYear, animeMonth, animeDay);
        })
    }
    // 初始化
    $initFn();
    // 添加列表元素
    function $addUrlEle(ele, animeNames, scAnimeNames, animeYear, animeMonth, animeDay) {
        // 当前元素
        var $selfEle = $(ele);
        // 没有添加元素的,添加列表
        if (!$selfEle.find('div').hasClass("box")) {
            /* ================ 跳转【国内查询】网站Start ================*/
            $selfEle.append('<div class="box"><p class="domesticClass">' + '<label>' + '<input type="checkbox" checked name="domesticSearch" class="domesticSearch" value="国内查询类">' + '国内查询类: ' + '</label>' +
                /* ========= 跳转豆瓣搜索页 =========*/
                addEle('a', '豆瓣', animeNames, 'https://www.douban.com/search?q=') +
                /* ========= 跳转萌娘百科搜索页 =========*/
                addEle('a', '萌娘百科(日文搜)', animeNames, 'https://zh.moegirl.org/') +
                /* ========= 跳转萌娘百科搜索页 =========*/
                addEle('a', '萌娘百科(中文搜)', scAnimeNames, 'https://zh.moegirl.org/') +
                /* ========= 跳转Voiux 动画搜索页 =========*/
                addEle('a', 'Voiux 动画', animeNames, 'https://bgm.voiux.com/bangumi/search?keyword=') +
                /* ========= 跳转 百度百科 搜索页 =========*/
                /*addEle('a', '百度百科', scAnimeNames ,
                  'https://baike.baidu.com/item/') +*/
                addEle('a', '百度百科', scAnimeNames, 'https://baike.baidu.com/search/none?word=', '&pn=0&rn=10&enc=utf8', ) + '</p>');
            /* ================ 跳转【国内查询】网站End ================*/
            /* ================ 跳转【国外查询】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="abroadSearch" class="abroadSearch" value="国外查询类">' + '国外查询类: ' + '</label>' +
                /* ========= 跳转AniDB搜索页 =========*/
                addEle('a', 'AniDB', animeNames, 'https://anidb.net/perl-bin/animedb.pl?adb.search=', '&show=animelist') +
                /* ========= 跳转MyAnimeList搜索页 =========*/
                addEle('a', 'MAL', animeNames, 'https://myanimelist.net/anime.php?q=') +
                /* ========= 跳转Anime News Network搜索页 =========*/
                addEle('a', 'ANN', animeNames, 'https://www.animenewsnetwork.com/encyclopedia/search/name?q=') +
                /* ========= 跳转TMDB搜索页 =========*/
                addEle('a', 'TMDB', animeNames, 'https://www.themoviedb.org/search?language=zh-CN&query=') +
                /* ========= 跳转TMDB搜索页 =========*/
                addEle('a', 'TVDB(需梯子)', animeNames, 'https://www.thetvdb.com/search?query=') +
                /* ========= 跳转Anikore(日本)搜索页 =========*/
                addEle('a', 'Anikore(日本)', animeNames, 'https://www.anikore.jp/anime_title/') +
                /* ========= 跳转syoboi(日本)搜索页 =========*/
                addEle('a', 'syoboi(日本)', animeNames, 'https://cal.syoboi.jp/find?sd=0&kw=', '&st=&cm=&r=0&rd=&v=0') +
                /* ========= 跳转 Fanart 搜索页 =========*/
                addEle('a', 'Fanart(有英文名时用)', animeNames, 'https://fanart.tv/?sect=all&s=') +
                /* ========= 跳转 IMDb 搜索页 =========*/
                addEle('a', 'IMDb', animeNames, 'https://www.imdb.com/find?q=', '&ref_=nv_sr_sm') +
                /* ========= 跳转 AniList 搜索页 =========*/
                addEle('a', 'AniList', animeNames, 'https://anilist.co/search/anime?search=') +
                /* ========= 跳转 KITSU 搜索页 =========*/
                addEle('a', 'KITSU', animeNames,
                    // 'https://anilist.co/search/anime?search=') +
                    'https://kitsu.io/anime?text=') +
                /* ========= 跳转 Anime-Planet 搜索页 =========*/
                addEle('a', 'Anime-Planet', animeNames, 'https://www.anime-planet.com/anime/all?name=') +
                /* ========= 跳转 V2Anime 搜索页 =========*/
                addEle('a', 'V2Anime', scAnimeNames, 'https://www.v2anime.com/search/?q=') +
                /* ========= 跳转 维基百科 搜索页 =========*/
                addEle('a', '维基百科(中文)', scAnimeNames, 'https://zh.wikipedia.org/zh-cn/') +
                /*addEle('a', '维基百科(中文)', scAnimeNames ,
                  'https://zh.jinzhao.wiki/wiki/') +*/
                /* ========= 跳转 维基百科 搜索页 =========*/
                addEle('a', '维基百科(日文)', animeNames, 'https://ja.wikipedia.org/wiki/') +
                /*addEle('a', '维基百科(日文)', animeNames ,
                  'https://ja.jinzhao.wiki/wiki/') +*/
                '</p>');
            /* ================ 跳转【国外查询】网站End ================*/
            /* ================ 跳转【BT下载】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" checked name="btDownload" class="btDownload" value="BT下载">' + 'BT下载: ' + '</label>' +
                /* ========= 跳转动漫花园搜索页 =========*/
                addEle('a', '动漫花园', scAnimeNames, 'https://share.dmhy.org/topics/list?keyword=') +
                /* ========= 跳转U2动漫花园搜索页 =========*/
                addEle('a', 'U2动漫花园(有账号的用)', animeNames, 'https://u2.dmhy.org/torrents.php?&spstate=0&inclbookmarked=0&search=', '&search_area=0&search_mode=0') +
                /* ========= 跳转Nyaa表站镜像 搜索页 =========*/
                addEle('a', 'Nyaa表站', animeNames, 'https://nyaa.si/?f=0&c=1_4&q=') +
                /*addEle('a', 'Nyaa表站', animeNames,
                 'https://nyaa.iss.one/?f=0&c=1_4&q=') +*/
                /* ========= 跳转Nyaa里站镜像 搜索页 =========*/
                addEle('a', 'Nyaa里站(需梯子)', animeNames, 'https://sukebei.nyaa.si/?f=0&c=1_1&q=') +
                /* ========= 跳转蜜柑计划 搜索页 =========*/
                addEle('a', '蜜柑计划', scAnimeNames, 'https://mikanani.me/Home/Search?searchstr=') +
                /* ========= 跳转VCB-Studio搜索页 =========*/
                addEle('a', 'VCB-Studio', scAnimeNames, 'https://vcb-s.com/?s=', '&submit=') +
                /* ========= 跳转末日動漫資源庫搜索页 =========*/
                addEle('a', '末日動漫資源庫', scAnimeNames, 'https://share.acgnx.net/search.php?sort_id=0&keyword=') + addEle('a', 'AniX.Moe', scAnimeNames, 'https://www.anix.moe/search.php?sort_id=0&keyword=') +
                /* ========= 跳转简单动漫 搜索页 =========*/
                addEle('a', '简单动漫', scAnimeNames, 'https://www.36dm.club/search.php?keyword=') +
                /* ========= 跳转Bangumi Moe萌番组 搜索页 =========*/
                /*addEle('a', '萌番组(需手动输入/点击)', scAnimeNames,
                 'https://bangumi.moe/search/title=') +*/
                /* ========= 跳转acg.rip 搜索页 =========*/
                addEle('a', 'acg.rip', scAnimeNames, 'https://acg.rip/?term=') +
                /* ========= 跳转 MioBT 搜索页 =========*/
                addEle('a', ' MioBT', scAnimeNames, 'https://miobt.com/search.php?keyword=') +
                /* ========= 跳转 爱恋动漫BT 搜索页 =========*/
                addEle('a', ' 爱恋BT', scAnimeNames, 'https://www.kisssub.org/search.php?keyword=') +
                /* ========= 跳转 漫猫动漫BT 搜索页 =========*/
                addEle('a', ' 漫猫BT', scAnimeNames, 'https://www.comicat.org/search.php?keyword=') +
                /* ========= 跳转嘀哩嘀哩BT站 搜索页 =========*/
                addEle('a', '嘀哩嘀哩BT站', scAnimeNames, 'https://www.dilidm.com/search-_', '.htm') +
                /* ========= Tokyo Toshokan搜索页 =========*/
                addEle('a', '东京图书馆', animeNames, 'https://www.tokyotosho.info/search.php?terms=', '&type=1&searchName=true&searchComment=true&size_min=&size_max=&username=') +
                /* ========= 跳转Voiux 动画(萌番组)搜索页 =========*/
                addEle('a', 'Voiux 动画(萌番组)', scAnimeNames, 'https://bgm.voiux.com/search/torrents?keyword=') +
                /* ========= 跳转Voiux 动画(Nyaa) 搜索页 =========*/
                addEle('a', 'Voiux 动画(Nyaa)', animeNames, 'https://bgm.voiux.com/torrents/search?s=nyaa&q=') +
                /* ========= 跳转Voiux 动画 搜索页 =========*/
                addEle('a', 'Voiux 动画(Anime-Sharing)', animeNames, 'https://bgm.voiux.com/anime-sharing/search?q=') + '</p>');
            /* ================ 跳转【BT下载】网站End ================*/
            /* ================ 跳转【论坛下载】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="bbsDownload" class="bbsDownload" value="论坛下载">' + '论坛下载: ' + '</label>' +
                /* ========= 天使动漫论坛搜索页 =========*/
                addEle('a', '天使动漫论坛(需登录)', scAnimeNames, 'https://www.tsdm39.net/plugin.php?id=Kahrpba:search&query=') +
                /* ========= 绯月论坛搜索页 =========*/
                addEle('a', '绯月论坛(需登录)', scAnimeNames, 'https://kf.miaola.info/thread.php?fid=92&page=8&keyword=') + '</p>');
            /* ================ 跳转【论坛下载】网站End ================*/
            /* ================ 跳转【字幕下载】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox"  name="subDownload" class="subDownload" value="在线播放">' + '字幕下载: ' + '</label>' +
                /* ========= 跳转U2动漫花园搜索页 =========*/
                addEle('a', 'U2动漫花园(有账号的用)', animeNames, 'https://u2.dmhy.org/subtitles.php?search=') +
                /* ========= 跳转VCB-S分享论坛搜索页 =========*/
                addEle('a', 'VCB-S分享论坛', animeNames, 'https://bbs.vcb-s.com/search.php?mod=forum&adv=yes&srchtxt=') +
                /* ========= 跳转VCB-S分享论坛(镜像)搜索页 =========*/
                addEle('a', 'VCB-S分享论坛(镜像)', animeNames, 'https://404.website/search.php?mod=forum&adv=yes&srchtxt=') +
                /* ========= 跳转射手网(伪)搜索页 =========*/
                addEle('a', '射手网(伪)', animeNames, 'https://assrt.net/sub/?searchword=') +
                /* ========= 跳转字幕库搜索页 =========*/
                addEle('a', '字幕库', animeNames, 'https://zimuku.org/search?q=') +
                /* ========= 跳转SubHD搜索页 =========*/
                addEle('a', 'SubHD', animeNames, 'https://subhd.tv/search/') +
                /* ========= 跳转SubHDTW搜索页 =========*/
                addEle('a', 'SubHDTW', animeNames, 'https://subhdtw.com/search/') +
                /* ========= 跳转sub_share: 字幕共享计划 页 =========*/
                addEle('a', '字幕共享计划(GitHub)', animeNames + '&animeYear=' + animeYear + '&animeMonth=' + animeMonth + '&animeDay=' + animeDay, 'https://github.com/foxofice/sub_share/tree/master/subs_list/animation?animeNames=', 1, 'AnimeSubShare') +
                /* ========= 跳转OpenSubtitles搜索页 =========*/
                addEle('a', 'OpenSubtitles(有英文名时用)', scAnimeNames, 'https://www.opensubtitles.org/zh/search2/sublanguageid-all/moviebytesize-78771737/moviename-') + '</p>');
            /* ================ 跳转【字幕下载】网站End ================*/
            /* ================ 跳转【在线播放】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox"  checked name="watchOnline" class="watchOnline" value="在线播放">' + '在线播放: ' + '</label>' +
                    /* ========= 跳转A站搜索页 =========*/
                    addEle('a', 'AcFun(A站)', scAnimeNames, 'https://www.acfun.cn/search?keyword=') +
                    /* ========= 跳转B站搜索页 =========*/
                    addEle('a', 'bilibili(B站', scAnimeNames, 'https://search.bilibili.com/all?keyword=') +
                    /* ========= 跳转C站搜索页 =========*/
                    addEle('a', 'tucao(C站', scAnimeNames, 'https://www.tucao.one/index.php?m=search&c=index&a=init2&catid=&time=&order=&username=&tag=&q=') +
                    /* ========= 跳转M站(哔咪哔咪)搜索页 =========*/
                    addEle('a', '哔咪哔咪(M站)', scAnimeNames, 'http://www.bimiacg.net/vod/search/wd/') +
                    /* ========= 跳转NT动漫搜索页 =========*/
                    addEle('a', 'NT动漫', scAnimeNames, 'http://www.ntyou.cc/search/-------------.html?wd=','&page=1') +
                    /* ========= 跳转zzzfun搜索页 =========*/
                    addEle('a', 'zzzfun(Z站)', scAnimeNames, 'http://www.zzzfun.com/vod_search.html?wd=') +
                    /* ========= 跳转omofun搜索页 =========*/
                    addEle('a', 'omofun', scAnimeNames, 'https://omofun.tv/index.php/vod/search.html?wd=') +
                    /* ========= 跳转动漫星球搜索页 =========*/
                    addEle('a', '动漫星球', scAnimeNames, 'https://www.dmxq.me/vodsearch/-------------.html?wd=') +
                    /* ========= 跳转異世界動漫搜索页 =========*/
                    addEle('a', '異世界動漫', scAnimeNames, 'https://www.gqdm.net/index.php/vod/search.html?wd=','&submit=') +
                    /* ========= 跳转拉拉动漫搜索页 =========*/
                    addEle('a', '拉拉动漫', scAnimeNames, 'http://www.acglala.me/vod-search?title=') +
                    /* ========= 跳转小丑动漫网搜索页 =========*/
                    addEle('a', '小丑动漫网', scAnimeNames, 'http://www.xcdm.net/vodsearch.html?wd=','&submit=') +
                    /* ========= 跳转樱花动漫(imomoe) 搜索页 =========*/
                    addEle('a', '樱花动漫(imomoe)', scAnimeNames, 'http://www.imomoe.ai/search.asp?searchword=') +
                    /* ========= 跳转樱花动漫(yhdm) 搜索页 =========*/
                    addEle('a', '樱花动漫(yhdm)', scAnimeNames, 'http://www.yhdm.io/search/') +
                    /* ========= 跳转AGE动漫 搜索页 =========*/
                    addEle('a', 'AGE动漫', scAnimeNames, 'https://www.agemys.com/search?query=', '&page=') +
                    /* ========= 跳转飞极速在线 搜索页 =========*/
                    addEle('a', '飞极速在线', scAnimeNames, 'http://feijisu7.com/search/') +
                    /* ========= 跳转妮可动漫 搜索页 =========*/
                    addEle('a', '妮可动漫', scAnimeNames, 'http://www.nicotv.me/video/search/', '.html') +
                    /* ========= 跳转 森之屋 搜索页 =========*/
                    addEle('a', '森之屋', animeNames, 'https://senfun.net/search.html?wd=') + '</p>')
                /* ================ 跳转【在线播放】网站End ================*/
                /* ================ 跳转【漫画类】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="Manga" class="btDownload Manga" value="漫画相关">' + '漫画类: ' + '</label>' +
                    /* ========= 跳转 动漫之家(在线) 搜索页 =========*/
                    addEle('a', '动漫之家(在线)', scAnimeNames, 'https://manhua.dmzj.com/tags/search.shtml?s=') +
                    /* ========= 跳转 看漫画/漫画柜(在线) 搜索页 =========*/
                    addEle('a', '看漫画/漫画柜(在线)', scAnimeNames, 'https://www.mhgui.com/s/', '.html') +
                    /* ========= 奇漫屋(下拉看) 搜索页 =========*/
                    addEle('a', '奇漫屋(下拉看)', scAnimeNames, 'http://www.qiman6.com/search.php?keyword=') +
                    /* ========= 最漫画(下拉看) 搜索页 =========*/
                    addEle('a', '最漫画(下拉看)', scAnimeNames, 'https://www.zuimh.com/search/?keywords=') +
                    /* ========= 看漫画(下拉看) 搜索页 =========*/
                    addEle('a', '看漫画(下拉看)', scAnimeNames, ' https://www.kanman.com/sort/#') +
                    /* ========= 跳转 动漫屋(在线) 搜索页 =========*/
                    addEle('a', '动漫屋(在线)', scAnimeNames, 'https://www.dm5.com/search?title=') +
                    /* ========= 跳转 漫畫聯合國(被墙/在线) 搜索页 =========*/
                    /*addEle('a', '漫畫聯合國(被墙/在线)', scAnimeNames,
                  'https://www.comicun.com/search-index?entry=', '&ie=gbk&q=' + scAnimeNames) +
*/
                    /* ========= 跳转 90漫画网(在线) 搜索页 =========*/
                    addEle('a', '90漫画网(在线/被墙)', scAnimeNames, 'http://www.90mh.com/search/?keywords=') +
                    /* ========= 跳转 98漫画网(在线) 搜索页 =========*/
                    addEle('a', '98漫画网(在线)', scAnimeNames, 'https://www.98mh.com/statics/search.aspx?key=') +
                    /* ========= 跳转 COCO漫画(在线) 搜索页 =========*/
                    addEle('a', 'COCO漫画(在线)', scAnimeNames, 'https://www.cocomanga.com/search?searchString=') +
                    /* ========= 跳转 xmanhua(F12下拉看)搜索页 =========*/
                    addEle('a', 'xmanhua(F12下拉看)', scAnimeNames, 'https://xmanhua.com/search?title=') +
                    /* ========= 跳转mangabz(F12下拉看) 搜索页 =========*/
                    addEle('a', 'mangabz(F12下拉看)', scAnimeNames, 'https://www.mangabz.com/search?title=') +
                    /* ========= 跳转 ol.moe(中文搜/在线+下载) 搜索页 =========*/
                    addEle('a', 'Vol.moe(中文搜/需登录下载)', scAnimeNames, 'https://mox.moe/list.php?s=') +
                    /* ========= 跳转 zero搬运网(在线+下载) 搜索页 =========*/
                    addEle('a', 'zero搬运网论坛(在线+下载)', scAnimeNames, 'http://www.zerobywtxt.com/plugin.php?id=jameson_manhua&a=search&c=index&keyword=') +
                    /* ========= 跳转 漫画补档(需登陆/在线+下载) 搜索页 =========*/
                    addEle('a', '漫画补档论坛(需登陆/在线+下载)', scAnimeNames, 'https://www.manhuabudang.com/?keyword=') +
                    /* ========= 跳转 漫画补档(在线+下载) 搜索页 =========*/
                    addEle('a', '萌享(MoeShar)论坛(需登陆/在线+下载)', scAnimeNames, 'https://moeshare.cc/?keyword=') +
                    /* ========= 13DL.NET(国外/下载) 搜索页 =========*/
                    addEle('a', '13DL.NET(国外/下载)', animeNames, 'https://13dl.me/search/','/') +
                    /* ========= Book Share ZIP(国外/下载) 搜索页 =========*/
                    addEle('a', 'Book Share ZIP(国外/下载)', animeNames, 'https://bszip.com/?s=') +
                    /* ========= Dl-Raw(国外/下载) 搜索页 =========*/
                    addEle('a', 'Dl-Raw(国外/下载)', animeNames, 'https://dl-raw.net/?s=') +
                    /* ========= Dl-Zip(国外/下载) 搜索页 =========*/
                    addEle('a', ' Dl-Zip(国外/下载)', animeNames, 'http://dl-zip.com/?s=') +
                    /* ========= MANGA(国外/下载) 搜索页 =========*/
                    addEle('a', ' MANGA(国外/下载)', animeNames, 'https://manga-zip.net/?s=') +
                    /* ========= Manga zone(国外/下载) 搜索页 =========*/
                    addEle('a', ' Manga zone(国外/下载)', animeNames, 'http://www.manga-zone.org/?s=') +
                    /* ========= Raw-Zip(国外/下载) 搜索页 =========*/
                    addEle('a', ' Raw-Zip(国外/下载)', animeNames, 'http://raw-zip.com/?s=') + '</p>')
                /* ================ 跳转【漫画类】网站End ================*/
                /* ================ 跳转【galgame类】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="galgame" class="btDownload galgame" value="galgame类">' + 'galgame类: ' + '</label>' +
                    /* ========= 跳转 松vndb(查询类) 搜索页 =========*/
                    addEle('a', 'vndb(查询类)', animeNames, 'https://vndb.org/v/all?sq=') +
                    /* ========= 跳转 2DFan 搜索页 =========*/
                    addEle('a', '2DFan(介绍+CG存档+补丁)', animeNames, 'https://galge.fun/subjects/search?keyword=') +
                    /* ========= 跳转 CnGal(介绍) 搜索页 =========*/
                    addEle('a', 'CnGal(介绍)', animeNames, 'https://www.cngal.org/search?keyword=') +
                    /* ========= 跳转 萌游网(介绍) 搜索页 =========*/
                    addEle('a', '萌游网(介绍)', animeNames, 'https://galge.cn/search?query=') +
                    /* ========= 跳转 绅士天堂 搜索页 =========*/
                    addEle('a', '绅士天堂', animeNames, 'https://www.aigalgame.com/?s=') +
                    /* ========= 跳转 忧郁的loli 搜索页 =========*/
                    addEle('a', '忧郁的loli', animeNames, 'https://www.okloli.com/?s=','&submit=') +
                    /* ========= 跳转 天使二次元(整合版) 搜索页 =========*/
                    /*addEle('a', '天使二次元(屏蔽大陆/硬盘版)', animeNames,
                      'https://www.tianshie.com/search/') +*/
                    /* ========= 跳转 galgame终点-论坛 搜索页 =========*/
                    addEle('a', 'galgame终点-论坛(需登陆)', animeNames, 'https://bbs.zdfx.net/search.php?keyword=') +
                    /* ========= 跳转 Say花火学园-论坛(整合版) 搜索页 =========*/
                    addEle('a', 'Say花火学园-论坛(需登陆)', animeNames, 'https://www.sayhuahuo.com/?keyword=') +
                    /* ========= 跳转 喵窝(生肉镜像) 搜索页 =========*/
                    /* addEle('a', '喵窝(生肉镜像)', animeNames,
                  'https://www.nyavo.com/?s=') +
*/
                    '</p>')
                /* ================ 跳转【galgame类】网站End ================*/
                /* ================ 跳转【轻小说类】网站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="Novel" class="btDownload Novel" value="轻小说类">' + '轻小说类: ' + '</label>' +
                /* ========= 跳转 轻之国度-论坛 搜索页 =========*/
                addEle('a', '轻之国度-论坛(需登陆/在线+下载)', animeNames, 'https://obsolete.lightnovel.us/search.php?keyword=') +
                /* ========= 跳转 真白萌Web小镇-论坛 搜索页 =========*/
                addEle('a', '真白萌Web小镇-论坛(需登陆/在线+下载)', animeNames, 'https://masiro.moe/search.php?keyword=') +
                /* ========= 跳转 轻之文库轻小说 搜索页 =========*/
                addEle('a', '轻之文库轻小说(原创)', animeNames, 'https://www.linovel.net/search/?kw=') +
                /* ========= 跳转 syosetu(小説家になろう) 搜索页 =========*/
                addEle('a', 'syosetu搜索(ハーメルン)', animeNames, 'https://syosetu.org/search/?word=') +
                /* ========= 跳转 轻小说之家(小説家になろう) 搜索页 =========*/
                addEle('a', '轻小说之家(小説家になろう)', animeNames, 'https://yomou.syosetu.com/search.php?search_type=novel&word=') +
                /* ========= 跳转 kakuyomu(カクヨム) 搜索页 =========*/
                addEle('a', 'kakuyomu(カクヨム)', animeNames, 'https://kakuyomu.jp/search?q=') +
                /* ================ 跳转【轻小说类】网站End ================*/
                '</p></div>')
        }
        // 设置a标签hover事件
        $(".toUrl").hover(function() {
            // hover时效果
            $(this).css({
                'color': 'red'
            });
        }, function() {
            //非 hover时效果
            $(this).css({
                'color': '#02A3FB'
            });
        });
        // 循环遍历inpt,判断是否隐藏
        $('.item.clearit .inner input').each(function(index, ele) {
            // 判断是否勾选
            var ischeck = $(this).attr("checked");
            // 判断是否勾选,隐藏/显示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
    }
    console.timeEnd('========== 这里结束 ===============');
    /*
      ('a','名称',搜索关键字,'url前缀','url后缀', 添加class)
     */
    function addEle(eleName, showName, parameter, urlPrefix, urlSuffix, addClass) {
        // 设置CSS字体颜色
        var fontColor = '#02A3FB';
        // 判断eleName参数是否为不空
        if (arguments[0] || arguments[0] == null || arguments[0] == false) {
            // 判断是否是添加a标签
            if (typeof arguments[0] == "string" && arguments[0] == 'a') {
                // 如果填写名称,进入判断
                if (arguments[1]) {
                    // 判断 搜索关键字参数是否填写,为字符串参数
                    if (arguments[2] && typeof arguments[2] == "string") {
                        // 保存动漫关键字
                        var AnimeKey = arguments[2];
                        // 获取最后字符串
                        var AnimeKeyLast = AnimeKey.substring(AnimeKey.length - 1);
                        // 保存数值
                        var indexNum = '';; // 判断结尾是否有,有的话删除重新赋值
                        if (AnimeKeyLast == "。" || AnimeKeyLast == ".") {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.substring(0, AnimeKey.length - 1);
                        }
                        // 判断关键字是否有。,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '。') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/。/g, " ");
                        }
                        // 判断关键字是否有、,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '、') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/、/g, " ");
                        }
                        // 判断关键字是否有!,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '!') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/!/g, " ");
                        }
                        // 判断关键字是否有！,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '！') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/！/g, " ");
                        }
                        // 判断关键字是否有・中间.,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '・') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/・/g, " ");
                            // AnimeKey =  AnimeKey.substring(0, AnimeKey.indexOf('・'));;
                        }
                        // 判断关键字是否有？,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '？') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/？/g, " ");
                        }
                        // 判断关键字是否有?,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '?') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\?/g, " ");
                        }
                        // 判断关键字是否有，,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '，') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\，/g, " ");
                        }
                        // 判断关键字是否有：,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '：') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\：/g, " ");
                        }
                        // 判断关键字是否有～,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '～') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\～/g, " ");
                        }
                        // 判断关键字是否有◆,有的话删除重新赋值
                        /* if (getCharCount(AnimeKey, '◆') != 0) {
                           // 删除。重新赋值
                           AnimeKey = AnimeKey.replace(/\◆/g," ");
                         }*/
                        // 判断关键字是否有超劇場版：,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '超劇場版') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/超劇場版/g, "");
                        }
                        // 判断关键字是否有劇場版：,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '劇場版') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/劇場版/g, "");
                        }
                        // 判断关键字是否有第一章......,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '第') != 0 && getCharCount(AnimeKey, '章') != 0) {
                            // 获取字符串截取索引
                            indexNum = AnimeKey.indexOf('第');
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判断关键字是否有前編,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '前編') != 0) {
                            // 获取字符串截取索引
                            indexNum = AnimeKey.indexOf('前編');
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判断关键字是否有後編,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '後編') != 0) {
                            // 获取字符串截取索引
                            indexNum = AnimeKey.indexOf('後編');
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判断关键字是否有特別編,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '特別編') != 0) {
                            // 获取字符串截取索引
                            indexNum = AnimeKey.indexOf('特別編');
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判断关键字是否有特別編,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '特别篇') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/特别篇/g, " ");
                        }
                        // 判断关键字是否有（,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '（') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/（/g, " ");
                        }
                        // 判断关键字是否有）,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '）') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/）/g, " ");
                        }
                        // 判断关键字是否有(有的话删除重新赋值
                        if (getCharCount(AnimeKey, '(') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\(/g, " ");
                        }
                        // 判断关键字是否有),有的话删除重新赋值
                        if (getCharCount(AnimeKey, ')') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\)/g, " ");
                        }
                        // 判断关键字是否有-,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '-') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\-/g, " ");
                        }
                        // 判断关键字是否有:,有的话删除重新赋值
                        if (getCharCount(AnimeKey, ':') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\:/g, " ");
                        }
                        // 判断关键字是否有短編,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '短編') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/短編/g, " ");
                        }
                        // 判断关键字是否有＊,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '＊') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/＊/g, " ");
                        }
                        // 判断关键字是否有＝,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '＝') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\＝/g, " ");
                        }
                        // 判断关键字是否有+,有的话删除重新赋值
                        if (getCharCount(AnimeKey, '+') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/\+/g, " ");
                        }
                        // 判断关键字是否有……,有的话删除重新赋值,比如小さな蕾のその奥に……
                        if (getCharCount(AnimeKey, '……') != 0) {
                            // 删除。重新赋值
                            AnimeKey = AnimeKey.replace(/……/g, " ");
                        }
                        // 判断关键字是否有ちょ〜短編,有的话删除重新赋值
                        /*if (getCharCount(AnimeKey, 'ちょ〜短編') != 0) {
                          // 删除。重新赋值
                          AnimeKey = AnimeKey.replace(/\ちょ〜短編/g," ");
                        }*/
                        // 判断是否填写url前缀
                        if (arguments[3]) {
                            // 判断是否填写url后缀
                            if (arguments[4]) {
                                if (arguments[4] == 1 && arguments[5]) {
                                    return '' + ' <a target="_blank" href="' +
                                        /* 以下添加链接 */
                                        arguments[3] + AnimeKey + '" class="toUrl ' +
                                        /* 以下添加class */
                                        arguments[5] +
                                        /* 以下添加样式 */
                                        '" style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                                }
                                return '' + ' <a class="toUrl" target="_blank" href="' +
                                    /* 以下添加链接 */
                                    arguments[3] + AnimeKey + arguments[4] + '" ' +
                                    /* 以下添加样式 */
                                    'style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                            } else {
                                return '<a class="toUrl" target="_blank" href="' +
                                    /* 以下添加链接 */
                                    arguments[3] + AnimeKey + '" ' +
                                    /* 以下添加样式 */
                                    'style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                            }
                        }
                    }
                }
            }
        }
        return '请填写参数';
    }
    // 判断字符串出现次数
    function getCharCount(str, char) {
        var result = (str.split(char)).length - 1;
        var count = !result ? 0 : result.length;
        return count;
    }
    // 获取传入url参数[得到url参数]为对象
    function getQueryArgs(url) {
        var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
            //保存每一项
            args = {},
            //得到每一项
            items = qs.length ? qs.split('&') : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split('='),
                name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }
    // 点击动漫年鉴 跳转
    $(document).on('click', '.AnimeYearbooks', function(event) {
            // 阻止a标签跳转
            event.preventDefault();
            // 获取当前url值
            var getHrefValue = $(this).attr('href');
            // 转化对象,重新赋值
            newObj = getQueryArgs(getHrefValue);
            // 创建变量保存跳转url
            var toUrlStr = '';
            // 获取年
            var animeYear = newObj['animeYear'];
            // 获取月
            var animeMonth = newObj['animeMonth'];
            // 获取日
            var animeDay = newObj['animeDay'];
            // 判断月,如果是01-09,去掉前面0,10,11,12保持原样
            animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
            // 判断是否有月
            var animeMonthFlag = false;
            // 保存月的范围
            var yearStr = '';
            if (animeMonth <= 3) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '1-3月';
            } else if (animeMonth <= 6) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '4-6月';
            } else if (animeMonth <= 9) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '7-9月';
            } else if (animeMonth <= 12) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '10-12月';
            }
            // 如果有月的话
            if (animeMonthFlag) {
                toUrlStr = 'https://www.xidoc.xyz/' + animeYear + '/' + animeYear + '年' + yearStr;
            } else {
                toUrlStr = 'https://www.xidoc.xyz/' + animeYear;
            }
            // 跳转页面
            window.open(toUrlStr, "_blank");
        })
        // 点击动漫年鉴/新站跳转
    $(document).on('click', '.AnimeYearbooks1', function(event) {
            // 阻止a标签跳转
            event.preventDefault();
            // 获取当前url值
            var getHrefValue = $(this).attr('href');
            // 转化对象,重新赋值
            newObj = getQueryArgs(getHrefValue);
            // 创建变量保存跳转url
            var toUrlStr = 'https://animeannals.xido.workers.dev/0:/';
            // 获取年
            var animeYear = newObj['animeYear'];
            // 获取月
            var animeMonth = newObj['animeMonth'];
            // 获取日
            var animeDay = newObj['animeDay'];
            // 判断月,如果是01-09,去掉前面0,10,11,12保持原样
            animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
            // 判断是否有月
            var animeMonthFlag = false;
            // 保存月的范围
            var yearStr = '';
            if (animeMonth <= 3) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '1-3月';
            } else if (animeMonth <= 6) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '4-6月';
            } else if (animeMonth <= 9) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '7-9月';
            } else if (animeMonth <= 12) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '10-12月';
            }
            // 如果有月的话
            if (animeMonthFlag) {
                // toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
                toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
            } else {
                // toUrlStr += animeYear + '/';
                toUrlStr += animeYear + '/';
            }
            // 跳转页面
            window.open(toUrlStr, "_blank");
        })
        // 点击动漫年鉴/下载站跳转
    $(document).on('click', '.AnimeYearbooks2', function(event) {
            // 阻止a标签跳转
            event.preventDefault();
            // 获取当前url值
            var getHrefValue = $(this).attr('href');
            // 转化对象,重新赋值
            newObj = getQueryArgs(getHrefValue);
            // 创建变量保存跳转url
            var toUrlStr = 'https://aacg.gq/';
            // 获取年
            var animeYear = newObj['animeYear'];
            // 获取月
            var animeMonth = newObj['animeMonth'];
            // 获取日
            var animeDay = newObj['animeDay'];
            // 判断月,如果是01-09,去掉前面0,10,11,12保持原样
            animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
            // 判断是否有月
            var animeMonthFlag = false;
            // 保存月的范围
            var yearStr = '';
            if (animeMonth <= 3) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '1-3月';
            } else if (animeMonth <= 6) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '4-6月';
            } else if (animeMonth <= 9) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '7-9月';
            } else if (animeMonth <= 12) {
                animeMonthFlag = true;
                // 赋值
                yearStr = '10-12月';
            }
            // 如果有月的话
            if (animeMonthFlag) {
                // toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
                toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
            } else {
                // toUrlStr += animeYear + '/';
                toUrlStr += animeYear + '/';
            }
            // 跳转页面
            window.open(toUrlStr, "_blank");
        })
        // 点击sub_share字幕共享计划 跳转
    $(document).on('click', '.AnimeSubShare', function(event) {
            // 阻止a标签跳转
            event.preventDefault();
            // 获取当前url值
            var getHrefValue = $(this).attr('href');
            // 声明变量
            var newObj = null;
            // 转化对象,重新赋值
            newObj = getQueryArgs(getHrefValue);
            // 创建变量保存跳转url
            var toUrlStr = '';
            // 获取年
            var animeYear = newObj['animeYear'];
            // 赋值
            toUrlStr = 'https://github.com/foxofice/sub_share/tree/master/subs_list/animation/' + animeYear;
            // 跳转页面
            window.open(toUrlStr, "_blank");
        })
        /* ===================  国内查询 Start =================== */
        // 国外查询 点击复选框
    $(document).on('click', 'input[name="domesticSearch"]', function(e) {
            // 判断是否勾选
            var ischeck = $(this).attr("checked");
            // 判断是否勾选,隐藏/显示
            if (ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
                $(this).removeAttr('checked');
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
                $(this).attr('checked', true);
            }
        })
        /* ===================  国内查询 End =================== */
        /* ===================  国外查询 Start =================== */
        // 循环遍历
        /*  $('input[name="abroadSearch"]').each(function(index, ele) {
                  // 判断是否勾选
                  var ischeck = $(this).attr("checked");
                  // 判断是否勾选,隐藏/显示
                  if (!ischeck) {
                      $(this).parent().parent().find('a').hide();
                      $(this).parent().parent().find('span').hide();
                  } else {
                      $(this).parent().parent().find('a').show();
                      $(this).parent().parent().find('span').show();
                  }
              })*/
        // 国外查询 点击复选框
    $(document).on('click', 'input[name="abroadSearch"]', function(e) {
        // 判断是否勾选
        var ischeck = $(this).attr("checked");
        // 判断是否勾选,隐藏/显示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  国外查询 End =================== */
    /* ===================  BT下载 Start =================== */
    // 循环遍历
    /*  $('.btDownload').each(function(index, ele) {
              // 判断是否勾选
              var ischeck = $(this).attr("checked");
              // 判断是否勾选,隐藏/显示
              if (!ischeck) {
                  $(this).parent().parent().find('a').hide();
                  $(this).parent().parent().find('span').hide();
              } else {
                  $(this).parent().parent().find('a').show();
                  $(this).parent().parent().find('span').show();
              }
          })*/
    // BT下载 点击复选框
    $(document).on('click', '.btDownload', function(e) {
        // 判断是否勾选
        var ischeck = $(this).attr("checked");
        // 判断是否勾选,隐藏/显示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  BT下载 End =================== */
    /* ===================  绯月论坛 Start =================== */
    // 循环遍历
    /* $('.bbsDownload').each(function(index, ele) {
             // 判断是否勾选
             var ischeck = $(this).attr("checked");
             // 判断是否勾选,隐藏/显示
             if (!ischeck) {
                 $(this).parent().parent().find('a').hide();
                 $(this).parent().parent().find('span').hide();
             } else {
                 $(this).parent().parent().find('a').show();
                 $(this).parent().parent().find('span').show();
             }
         })*/
    // 绯月论坛 点击复选框
    $(document).on('click', '.bbsDownload', function(e) {
        // 判断是否勾选
        var ischeck = $(this).attr("checked");
        // 判断是否勾选,隐藏/显示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  绯月论坛 End =================== */
    /* ===================  国外查询 Start =================== */
    // 循环遍历
    /*  $('input[name="subDownload"]').each(function(index, ele) {
              // 判断是否勾选
              var ischeck = $(this).attr("checked");
              // 判断是否勾选,隐藏/显示
              if (!ischeck) {
                  $(this).parent().parent().find('a').hide();
                  $(this).parent().parent().find('span').hide();
              } else {
                  $(this).parent().parent().find('a').show();
                  $(this).parent().parent().find('span').show();
              }
          })*/
    // 国外查询 点击复选框
    $(document).on('click', 'input[name="subDownload"]', function(e) {
        // 判断是否勾选
        var ischeck = $(this).attr("checked");
        // 判断是否勾选,隐藏/显示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  国外查询 End =================== */
    /* ===================  在线播放 Start =================== */
    // 循环遍历
    $('.watchOnline').each(function(index, ele) {
            // 判断是否勾选
            var ischeck = $(this).attr("checked");
            // 判断是否勾选,隐藏/显示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // 在线播放 点击复选框
    $(document).on('click', '.watchOnline', function(e) {
        // 判断是否勾选
        var ischeck = $(this).attr("checked");
        // 判断是否勾选,隐藏/显示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  在线播放 End =================== */
    /* ===================  添加一键跳转按钮 Start =================== */
    // 添加【一键批量打开】按钮
    $('#browserTools').append('<button id="btnClass" class="btnClass">一键批量打开</botton>');
    // 添加【一键定位(按搜索名)】按钮
    $('#browserTools').append('<button id="locationBtn" class="btnClass">一键定位(按搜索名)</botton>');
    // $('#browserTools').append('<button id="locationBtn" class="btnClass">一键正序排序</botton>');
    // 获取标签数
    var labelSum = $('#userTagList li').length;
    // 获取当前列表总数
    var items = $('li.item').length;
    // 判断当前是否列表页,是的话添加刷新按钮
    if (items > 0) {
        // 判断如果有标签,说明是收藏页
        if (labelSum > 0) {
            // 【展开全部标签】
            $('#userTagList li').show();
            $('#expandTags').remove();
            // 头部添加【点击刷新(当前列表共0条)】按钮
            $('#browserTools').append('<button index="1" class="btnClass fixedLeft">点击刷新(当前列表共' + items + '条 / 标签数共' + labelSum + '条)</botton>');
            // 页面左下角添加【点击刷新(当前列表共0条)】按钮
            $('body').append('<button id="getListLength" index="1" class="btnClass fixedLeft fixedLeft1">点击刷新(当前列表共' + items + '条 / 标签数共' + labelSum + '条)</botton>');
        } else {
            // 头部添加【点击刷新(当前列表共0条)】按钮
            $('#browserTools').append('<button index="0" class="btnClass fixedLeft">点击刷新(当前列表共' + items + '条)</botton>');
            // 页面左下角添加【点击刷新(当前列表共0条)】按钮
            $('body').append('<button id="getListLength" index="0" class="btnClass fixedLeft fixedLeft1">点击刷新(当前列表共' + items + '条)</botton>');
        }
    }
    // 设置样式
    $('.btnClass').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "border": "1px solid transparent",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "0 15px",
        "font-size": "14px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        // "background-color": "#FF5A44",
        "background-color": "#F09199",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)"
    });
    $('.fixedLeft1').css({
            "position": "fixed",
            "bottom": "0",
            "z-index": "999",
            "left": "0",
            'font-size': '12px'
        })
        // 设置按钮hover事件
    $('.btnClass').hover(function() {
        // hover时效果
        $(this).css({
            'background': '#02A3FB',
            "border": "1px solid transparent"
        });
    }, function() {
        //非 hover时效果
        $(this).css({
            'background': '#F09199'
        });
    });
    // 保存url等信息
    var objList = {
        toUrls: [],
        isZhKey: false,
        isJpKey: false,
        isZhIndex: [],
        isJpIndex: []
    };
    // 循环遍历【中文辩题】链接地址
    $('.inner h3 a').each(function(index, ele) {
            // 判断是否勾选
            var selfAEle = $(this).prop('href');
            // 添加链接
            objList.toUrls.push(selfAEle);
            // 获取输入框内容
            var inputBox = $('.searchInputL').val();
            // 判断是否有搜索结果
            var isValue = $(this).text();
            isValue = isValue.indexOf(inputBox);
            // 如果不为空,进入判断
            if (isValue) {
                objList.isZhKey = true;
                objList.isZhIndex.push(index);
            }
        })
        // 循环遍历【日文名】
    $('.inner h3 small').each(function(index, ele) {
            // 获取输入框内容
            var inputBox = $('.searchInputL').val();
            // 判断是否有搜索结果
            var isValue = $(this).text();
            isValue = isValue.indexOf(inputBox);
            // 如果不为空,进入判断
            if (isValue) {
                objList.isJpKey = true;
                objList.isJpIndex.push(index);
            }
        })
        // 点击【一键批量打开】
    $('#btnClass').click(function() {
        // 判断是否使用自动加载下一页脚本,如果加载了下一页,重新循环遍历更改值
        if ($('.inner h3 a').length != objList.toUrls.length) {
            // 初始化url等信息
            objList = {
                toUrls: [],
                isZhKey: false,
                isJpKey: false,
                isZhIndex: [],
                isJpIndex: []
            };
            // 循环遍历【中文辩题】链接地址
            $('.inner h3 a').each(function(index, ele) {
                // 判断是否勾选
                var selfAEle = $(this).prop('href');
                // 添加链接
                objList.toUrls.push(selfAEle);
                // 获取输入框内容
                var inputBox = $('.searchInputL').val();
                // 判断是否有搜索结果
                var isValue = $(this).text();
                isValue = isValue.indexOf(inputBox);
                // 如果不为空,进入判断
                if (isValue) {
                    objList.isZhKey = true;
                    objList.isZhIndex.push(index);
                }
            })
        }
        // 循环遍历跳转链接
        for (var i = 0; i < objList.toUrls.length; i++) {
            // 同时打开
            window.open(objList.toUrls[i], "_blank");
        }
        /*console.log(
          objList.toUrls
        );*/
    });
    // 点击【一键定位(按搜索名)】按钮
    $('#locationBtn').click(function() {
        // $('#browserItemList li').eq(1).prependTo('#browserItemList')
        // 是否搜的中文名
        var isZhKey = objList['isZhKey'];
        // 是否搜的日文名
        var isJpKey = objList['isJpKey'];
        // 获取搜到的中文名结果
        var isZhIndex = objList['isZhIndex'];
        // 获取搜到的日文名结果
        var isJpIndex = objList['isJpIndex'];
        // 最终定位结果
        var retIndex = false;
        // 如果有中文结果,或者中文/日文都有结果的话
        if (isZhKey || isZhKey && isJpKey) {
            retIndex = isZhIndex;
        } else if (isJpKey) {
            retIndex = isJpIndex;
        }
        // 如果能搜到的话
        if (retIndex) {
            // 获取元素位置
            var toLocatio = $('#browserItemList li').eq(retIndex[0]).offset().top;
            // 跳转到搜索的第一个结果
            $("html,body").animate({
                scrollTop: toLocatio
            }, 500);
        }
    });
    // 点击【点击刷新(当前列表共xxx条)】或【点击刷新(当前列表共xxx条 / 标签数共xxx条)】按钮
    $(document).on('click', '.fixedLeft', function(e) {
        // 获取按钮列表
        var fixedLeft = document.querySelectorAll('.fixedLeft');
        // 判断是否是收藏页还是搜索页
        if ($(this).attr('index') == 1) {
            // 获取标签页数量
            var labelSum = $('#userTagList li').length;
            // 循环遍历
            for (var i = 0; i < fixedLeft.length; i++) {
                fixedLeft[i].innerText = '点击刷新(当前列表共' + $('li.item').length + '条 / 标签数共' + labelSum + '条)';
            }
        } else {
            // 循环遍历
            for (var i = 0; i < fixedLeft.length; i++) {
                fixedLeft[i].innerText = '点击刷新(当前列表共' + $('li.item').length + '条)';
            }
        }
        // 循环遍历li,添加跳转a标签
        $initFn();
        // 添加按钮
        $addBtn();
    });
    /* ===================  添加一键跳转按钮 End =================== */
    /* ===================  添加新标签打开 Start ===================
                          2020年6月18日19:03:15
                          2020年6月18日20:40:32
    */
    function $addBtn() {
        // 清空按钮,防止自动刷新下一页,添加按钮重复
        $('.addBtn').remove();
        // 添加按钮
        if ($('p.rateInfo').length != 0) {
            $('p.domesticClass').before('<button class="addBtn showHiheBtn" flag="1">显示/隐藏列表</button>');
            $('p.domesticClass').before('<button class="addBtn toNewUrl">新标签打开</button>');
            $('p.domesticClass').before('<button class="addBtn toDetailsPageAndAniDB">同时打开详情页/AniDB</button>');
        } else {
            $('p.info.tip').after('<button class="addBtn toDetailsPageAndAniDB">同时打开详情页/AniDB</button>');
            $('p.info.tip').after('<button class="addBtn toNewUrl">新标签打开</button>');
            $('p.info.tip').after('<button class="addBtn showHiheBtn" flag="1">显示/隐藏列表</button>');;
        }
        // 设置【新标签打开】按钮样式
        $('.toNewUrl').css({
            "margin": "10px 5px",
            "color": "#fff",
            "line-height": "1.499",
            "position": "relative",
            "display": "inline-block",
            "font-weight": "400",
            "white-space": "nowrap",
            "text-align": "center",
            "background-image": "none",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "cursor": "pointer",
            "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "-ms-touch-action": "manipulation",
            "touch-action": "manipulation",
            "height": "32px",
            "padding": "5px",
            "font-size": "12px",
            "border-radius": "4px",
            "background-color": "#fff",
            "border-color": "#d9d9d9",
            "background-color": "#4EB1D4",
            "border-color": "#FF5A44",
            "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "border": "1px solid transparent"
        });
        // 设置同时打开详情页/AniDB 按钮样式
        $('.toDetailsPageAndAniDB').css({
            "margin": "10px 5px",
            "color": "#fff",
            "line-height": "1.499",
            "position": "relative",
            "display": "inline-block",
            "font-weight": "400",
            "white-space": "nowrap",
            "text-align": "center",
            "background-image": "none",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "cursor": "pointer",
            "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "-ms-touch-action": "manipulation",
            "touch-action": "manipulation",
            "height": "32px",
            "padding": "5px",
            "font-size": "12px",
            "border-radius": "4px",
            "background-color": "#fff",
            "border-color": "#d9d9d9",
            "background-color": "#4EB1D4",
            "border-color": "#FF5A44",
            "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "border": "1px solid transparent"
        });
        // 设置【显示/隐藏列表】按钮样式
        $('.showHiheBtn').css({
            "margin": "10px 5px",
            "color": "#fff",
            "line-height": "1.499",
            "position": "relative",
            "display": "inline-block",
            "font-weight": "400",
            "white-space": "nowrap",
            "text-align": "center",
            "background-image": "none",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
            "cursor": "pointer",
            "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "-ms-touch-action": "manipulation",
            "touch-action": "manipulation",
            "height": "32px",
            "padding": "5px",
            "font-size": "12px",
            "border-radius": "4px",
            "background-color": "#fff",
            "border-color": "#d9d9d9",
            "background-color": "#4EB1D4",
            "border-color": "#FF5A44",
            "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
            "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
            "border": "1px solid transparent"
        });
        // 设置【新标签跳转】按钮hover事件
        $('.toNewUrl').hover(function() {
            // hover时效果
            // 添加点击透明度更改,有点击效果
            $(this).css({
                'opacity': '0.5'
            })
        }, function() {
            //非 hover时效果
            $(this).css({
                'opacity': '1'
            });
        });
        // 设置【同时打开详情页/AniDB 按钮样式】按钮hover事件
        $('.toDetailsPageAndAniDB').hover(function() {
            // hover时效果
            // 添加点击透明度更改,有点击效果
            $(this).css({
                'opacity': '0.5'
            })
        }, function() {
            //非 hover时效果
            $(this).css({
                'opacity': '1'
            });
        });
        // 设置【显示/隐藏列表】按钮hover事件
        $('.showHiheBtn').hover(function() {
            // hover时效果
            // 添加点击透明度更改,有点击效果
            $(this).css({
                'opacity': '0.5'
            })
        }, function() {
            //非 hover时效果
            $(this).css({
                'opacity': '1'
            });
        });
        // 默认隐藏
        $('.showHiheBtn').click();
    }
    // 添加按钮
    $addBtn();
    // 点击【新标签跳转】按钮,触发点击事件
    $(document).on('click', '.toNewUrl', function(e) {
        // 获取当前列表a标签链接
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
        // 新标签打开
        window.open(selfUrl, "_blank");
    });
    // 点击【同时打开详情页/AniDB 按钮样式】按钮,触发点击事件
    $(document).on('click', '.toDetailsPageAndAniDB', function(e) {
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
        // 新标签打开
        window.open(selfUrl, "_blank");
        // 获取AniDB的位置索引正确
        var AniDBIndex = 0;
        $(this).parent().parent().find('p').each(function(index, ele) {
                // 判断索引
                if ($(this).find('a:eq(0)').html() == "AniDB") {
                    AniDBIndex = index;
                }
            })
            // 获取当前AniDB的a标签链接
        var selftoAniDBUrl = $(this).parent().parent().find('p:eq(' + AniDBIndex + ') a:eq(0)').prop('href');
        // 新标签打开
        window.open(selftoAniDBUrl, "_blank");
    });
    // 点击【显示/隐藏列表】按钮
    $(document).on('click', '.showHiheBtn', function(e) {
        // 获取当前列表p标签
        var selfUrl = $(this).parent().parent().find('p');
        // 获取当前按钮属性
        var flag = $(this).attr('flag');
        // 如果是1,说明默认显示,点击隐藏,否则的话显示
        if (flag == 1) {
            $(this).attr('flag', 0);
            for (var i = 1; i < selfUrl.length; i++) {
                // 判断是否是评分P标签,是的话跳过
                if (!selfUrl.eq(i).hasClass("rateInfo") && !selfUrl.eq(i).hasClass("collectInfo") && !selfUrl.eq(i).hasClass("tools") && !selfUrl.eq(i).hasClass("tip")) {
                    selfUrl.eq(i).hide();
                }
            }
        } else {
            $(this).attr('flag', 1);
            for (var i = 1; i < selfUrl.length; i++) {
                // 判断是否是评分P标签,是的话跳过
                if (!selfUrl.eq(i).hasClass("rateInfo") && !selfUrl.eq(i).hasClass("collectInfo") && !selfUrl.eq(i).hasClass("tip")) {
                    selfUrl.eq(i).show();
                }
            }
        }
    });
    // 默认隐藏
    $('.showHiheBtn').click();
    // 4.设置【显示/隐藏列表】按钮hover事件
    $('.showHiheBtn').hover(function() {
        // hover时效果
        // 添加点击透明度更改,有点击效果
        $(this).css({
            'opacity': '0.5'
        })
    }, function() {
        //非 hover时效果
        $(this).css({
            'opacity': '1'
        });
    });
    /* ========================================================== */
    // 封装复制函数
    function copyFn(ele, copyText) {
        // 更改input内容
        $(ele).val(copyText)
            // 全选输入框内容
        $(ele).select();
        // 执行浏览器自带的复制
        document.execCommand("Copy");
        // 清空输入框内容
        $(ele).val('')
    }
    /*
       封装函数获取年/月/日 格式日期,并更改年月日格式
       2020年6月21日21:51:15完美封装
       2020年7月4日13:28:38 更改2015格式并添加年
       2020年8月13日20:55:43 新增"2020-10"和"2020-3"格式判断
       2020年8月17日22:58:51 新增1986.10.15 / 1986.10.5 / 1986.1.15 / 1986.1.3 格式判断
      */
    function getListDate(value, isGetYearValue) {
        // 获取传的值
        var str = value;
        // 创建新字符串保存
        var ret = "";
        // 创建最终返回字符串
        var retStr = "";
        // 循环去除空格
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) != " ") {
                ret += str[i];
            }
        }
        // 分类
        var str1 = "";
        var str2 = "";
        var str3 = "";
        var str4 = "";
        var index = 0;
        var dateType = 0;
        // 如果有年月日格式
        if (ret.indexOf('年') != -1 && ret.indexOf('月') == -1 & ret.indexOf('日') == -1) {
            dateType = 1;
            index = ret.indexOf('年');
        } else if (ret.indexOf('月') != -1 && ret.indexOf('日') == -1) {
            dateType = 2;
            index = ret.indexOf('月');
        } else if (ret.indexOf('年') != -1 && ret.indexOf('月') != -1 && ret.indexOf('日') != -1) {
            dateType = 3;
            index = ret.indexOf('日');
        } else if ((/^\+?[0-9][0-9]*$/).test(ret)) { // 判断是否为2015这样的格式
            dateType = 6;
            index = ret + '年';
        }
        // 判断是否有春/夏/秋/冬
        if (ret.indexOf('春') != -1) {
            dateType = 4;
            index = ret.indexOf('春');
        } else if (ret.indexOf('夏') != -1) {
            dateType = 4;
            index = ret.indexOf('夏');
        } else if (ret.indexOf('秋') != -1) {
            dateType = 4;
            index = ret.indexOf('秋');
        } else if (ret.indexOf('冬') != -1) {
            dateType = 4;
            index = ret.indexOf('冬');
        }
        // 判断是否为年/月/日格式
        // 判断年月日格式
        if (ret.substring(4, 5) == '-' && ret.substring(7, 8) == '-' || ret.substring(4, 5) == '/' && ret.substring(7, 8) == '/' || ret.substring(4, 5) == '-') {
            // 赋值类型是/或-
            dateType = 5;
            // 判断2020-02-28和2020/02/28/*
            // 判断2020-02-2和2020/02/2/*
            if (ret.substring(8, 10).indexOf('/') == -1 && ret.substring(8, 10).length == 2) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月" + ret.substring(8, 10) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.substring(8, 10).length == 1) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月0" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == 1 && ret.substring(8, 10).length == 2) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月0" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == 1 && ret.substring(8, 10).length == 3) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.length == 7) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.length == 6) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 7) + "月";
            }
        } else if (ret.substring(4, 5) == '-' && ret.substring(6, 7) == '-' || ret.substring(4, 5) == '/' && ret.substring(6, 7) == '/') {
            // 赋值类型是/或-
            dateType = 5;
            // 判断2020-2-28和2020/2/28/*
            // 判断2020-2-2和2020/2/2/*
            if (ret.substring(7, 9).indexOf('/') == -1 && ret.substring(7, 9).length == 2) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月" + ret.substring(7, 9) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == -1 && ret.substring(7, 9).length == 1) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月0" + ret.substring(7, 9) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == 1 && ret.substring(7, 9).length == 2) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月0" + ret.substring(7, 8) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == 1 && ret.substring(7, 9).length == 3) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月" + ret.substring(7, 9) + "日";
            }
        } else if (ret.substring(4, 5) == '.') {
            // 赋值类型是/或-
            dateType = 7;
            // 判断1986.10.15和1986.10.15/*
            if (ret.substring(7, 8) == '.') {
                if (ret.substring(8, 10).length == 2) {
                    if (myIsNaN(ret[9] - 1)) {
                        str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月' + ret.substring(8, 10) + '日';
                    } else {
                        str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月0' + ret.substring(8, 9) + '日';
                    }
                } else if (ret.substring(8, 10).length == 1) {
                    str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月0' + ret.substring(8, 9) + '日';
                }
            } else if (ret[6] == '.') {
                // 判断1986.1.15格式
                if (ret.substring(7, 9).length == 2) {
                    if (myIsNaN(ret[8] - 1)) {
                        str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月' + ret.substring(7, 9) + '日';
                    } else {
                        str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月0' + ret.substring(7, 8) + '日';
                    }
                } else if (ret.substring(7, 9).length == 1) {
                    str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月0' + ret.substring(7, 8) + '日';
                }
            }
        }
        // 最后判断,并赋值
        if (dateType == 1) {
            if (ret.indexOf('年') == ret.length - 1 || ret.substring(index + 1, index + 2) == '/' || ret.substring(ret.length, ret.length + 1) == '') {
                retStr = ret.substring(0, index + 1);
            }
        } else if (dateType == 2) {
            if (ret.indexOf('月') == ret.length - 1 || ret.substring(index + 1, index + 2) == '/' || ret.substring(ret.length, ret.length + 1) == '') {
                retStr = ret.substring(0, index + 1);
            }
        } else if (dateType == 3) {
            // 判断格式
            if (ret.substr(4, 1) == '年' && ret.substr(7, 1) == '月' && ret.substr(10, 1) == '日') {
                // 如果日后面没多余的字符的话
                if (ret.substr(11, 1).length == 0) {
                    retStr = ret.substr(0, 11);
                } else if (ret.substr(11, 1).length == 1 && ret.substr(11, 1) == '/') {
                    retStr = ret.substr(0, 11);
                }
            } else if (ret.substr(4, 1) == '年' && ret.substr(7, 1) == '月' && ret.substr(9, 1) == '日') {
                retStr = ret.substr(0, 8) + '0' + ret.substr(8, 2);
            } else if (ret.substr(4, 1) == '年' && ret.substr(6, 1) == '月' && ret.substr(9, 1) == '日') {
                retStr = ret.substr(0, 5) + '0' + ret.substr(5, 2) + ret.substr(7, 3);
            } else if (ret.substr(4, 1) == '年' && ret.substr(6, 1) == '月' && ret.substr(8, 1) == '日') {
                retStr = ret.substr(0, 5) + '0' + ret.substr(5, 2) + '0' + ret.substr(7, 2);
            }
        } else if (dateType == 4) {
            // 赋值
            retStr = ret.substring(0, index + 1);
        } else if (dateType == 5) {
            // 赋值
            retStr = str3;
        } else if (dateType == 6) {
            // 赋值
            retStr = index;
        } else if (dateType == 7) {
            // 赋值
            retStr = str4;
        }
        // 如果isGetYearValue为true,返回年
        if (isGetYearValue == true) {
            // 创建对象保存
            ret = {};
            // 保存年
            ret['year'] = retStr.slice(0, 4);
            //保存月
            ret['month'] = retStr.slice(5, 7);
            // 保存日
            ret['day'] = retStr.slice(8, 10);
            // 重新赋值
            retStr = ret;
        }
        // 返回xxxx年xx月xx日格式
        return retStr;
    }
    // 判断是否数字
    function myIsNaN(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    /* ===================  添加新标签打开+一键复制按钮 End =================== */
    /* ================== 监听键盘按下快捷键,来跳转或触发点击事件Start =================== */
    // 获取键盘码
    function getKeyCode(str) {
        // 获取当前字符串
        var getKey = str.toLocaleLowerCase();
        // 返回结果
        var ret = '';
        // 键码表
        var keyCode = {
                key: {
                    /* 字母和数字键的键码值 */
                    'a': 65,
                    'b': 66,
                    'c': 67,
                    'd': 68,
                    'e': 69,
                    'f': 70,
                    'g': 71,
                    'h': 72,
                    'i': 73,
                    'j': 74,
                    'k': 75,
                    'l': 76,
                    'm': 77,
                    'n': 78,
                    'o': 79,
                    'p': 80,
                    'q': 81,
                    'r': 82,
                    's': 83,
                    't': 84,
                    'u': 85,
                    'v': 86,
                    'w': 87,
                    'x': 88,
                    'y': 89,
                    'z': 90,
                    '0': 48,
                    '1': 49,
                    '2': 50,
                    '3': 51,
                    '4': 52,
                    '5': 53,
                    '6': 54,
                    '7': 55,
                    '8': 56,
                    '9': 57,
                    /* 数字键盘上的键的键码值 后面加_和主键盘数字键 区分开 */
                    '0_': 96,
                    '1_': 97,
                    '2_': 98,
                    '3_': 99,
                    '4_': 100,
                    '5_': 101,
                    '6_': 102,
                    '7_': 103,
                    '8_': 104,
                    '9_': 105,
                    '*': 106,
                    '+_': 107,
                    'enter1': 108,
                    '-': 109,
                    '.': 110,
                    '/': 111,
                    /* 功能键键码值 */
                    'f1': 112,
                    'f2': 113,
                    'f3': 114,
                    'f4': 115,
                    'f5': 116,
                    'f6': 117,
                    'f7': 118,
                    'f8': 119,
                    'f9': 120,
                    'f10': 121,
                    'f11': 122,
                    'f12': 123,
                    /* 控制键键码值 */
                    'backspace': 8,
                    'tab': 9,
                    'clear': 12,
                    'enter': 13,
                    'shift': 16,
                    'ctrl': 17,
                    'control': 17,
                    'alt': 19,
                    'cape lock': 20,
                    'esc': 27,
                    'spacebar': 32,
                    'page up': 33,
                    'page down': 34,
                    'end': 35,
                    'home': 36,
                    'left arrow': 37,
                    'up arrow': 38,
                    'right arrow': 39,
                    'down arrow': 40,
                    'insert': 45,
                    'delete': 46,
                    'num lock': 144,
                    ';': 186,
                    ':': 186,
                    '=': 187,
                    '+': 187,
                    '-': 189,
                    '_': 189,
                    '.': 190,
                    '>': 190,
                    '/': 191,
                    '?': 191,
                    '`': 192,
                    '~': 192,
                    '[': 219,
                    '{': 219,
                    '/': 220,
                    '|': 220,
                    ']': 221,
                    '}': 221
                }
            }
            // 循环遍历
        for (var i in keyCode['key']) {
            // 判断是否有当前key值
            if (i == getKey) {
                // 返回结果
                ret = keyCode['key'][i];
            }
        }
        return ret;
    }
    // 监听键盘按下事件
    $(document).keydown(function(e) {
        /*  console.log
            e
          );*/
        // 获取键盘控制键
        var keyCode = e.keyCode || e.which || e.charCode;
        // 获取Ctrl键,返回true和false
        var ctrlKey = e.ctrlKey || e.metaKey;
        // 获取Shift键,返回true和false
        var shiftKey = e.shiftKey || e.metaKey;
        // 获取Alt键,返回true和false
        var altKey = e.altKey || e.metaKey;
        // 如果是单个键的话
        // 判断选择哪个快捷键,动态获取哪个页面
        if (keyCode == 13) {
            // 如果搜索框不为空,进入判断
            if (document.querySelectorAll('.searchInputL')[0].value) {
                // 拼接url搜索地址
                var toUrlStr = 'https://bangumi.tv/subject_search/' + document.querySelectorAll('.searchInputL')[0].value + '?cat=';
                // 跳转页面
                window.open(toUrlStr + getQueryVariable('cat'), "_self");
                // 点击搜索按钮,会导致监听回车键失效
                // $('.searchBtnL').click();
            }
            console.log('回车键');
        }
        /* ========= 判断按下Ctrl + Shift  + Alt + 英文字母/数字快捷键 ============*/
        if (ctrlKey && shiftKey && altKey && keyCode == getKeyCode('X')) {
            console.log('Ctrl + Shift + Alt + X');
        } else if (ctrlKey && shiftKey && keyCode == getKeyCode('X')) {
            /* ========= 判断按下Ctrl + Shift  + 英文字母/数字快捷键 ============*/
            console.log('Ctrl + Shift + X');
        } else if (ctrlKey && altKey && keyCode == getKeyCode('X')) {
            /* ========= 判断按下Ctrl + Alt  + 英文字母/数字快捷键 ============*/
            console.log('Ctrl + Alt + X');
        } else if (shiftKey && altKey && keyCode == getKeyCode('X')) {
            /* ========= 判断按下Shift + Alt  + 英文字母/数字快捷键 ============*/
            console.log('Shift + Alt + X');
        } else if (ctrlKey && keyCode == getKeyCode('O')) {
            /* ========= 判断按下Ctrl + O ============*/
            console.log('Ctrl +  O');
        } else if (shiftKey && keyCode == getKeyCode('Z')) {
            /* ========= 判断按下Shift + Z  ============*/
            // 点击【一键批量打开】
            $('#btnClass').click();
            console.log('Shift +  Z');
        } else if (shiftKey && keyCode == getKeyCode('R')) {
            /* ========= 判断按下Shift + R  ============*/
            // 点击【点击刷新(当前列表共xxx条)】或【点击刷新(当前列表共xxx条 / 标签数共xxx条)】按钮
            $('.fixedLeft').click();
            console.log('Shift +  R');
        } else if (altKey && keyCode == getKeyCode('X')) {
            /* ========= 判断按下Alt + 英文字母/数字快捷键 ============*/
            console.log('Alt +  X');
        }
        // 阻止默认事件
        // e.preventDefault();
        // return false;
        return;
    });
    // 获取url参数[得到url参数]为对象
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    /* ================== 判断滚动事件,搜索框置顶 Start =================== */
    // 获取要定位元素距离浏览器顶部的距离
    var navH = $(".searchBox.clearit > form").offset().top;
    // 滚动条事件
    $(window).scroll(function() {
            // 获取滚动条的滑动距离
            var scroH = $(this).scrollTop();
            // 滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
            if (scroH >= navH) {
                // 更改父级样式
                $('.searchBox').css({
                        'width': '100%'
                    })
                    // 更改搜索框样式
                $(".searchBox.clearit > form").css({
                    'position': 'fixed',
                    'display': 'table-cell',
                    'text-align': 'center',
                    'z-index': '100',
                    'width': '100%'
                });
                // 更改搜索按钮样式
                $('.searchBtnL').css({
                    'margin-left': '2px'
                })
            } else if (scroH < navH) {
                // 恢复父级样式
                $('.searchBox').css({
                        'width': '980px'
                    })
                    // 恢复搜索框样式
                $(".searchBox.clearit > form").css({
                    "position": "static"
                });
                // 更改搜索按钮样式
                $('.searchBtnL').css({
                    'margin-left': '2px'
                })
            }
        })
        /* ================== 判断滚动事件,搜索框置顶 End =================== */
        /* ================== 监听按下Ctrl + V粘贴键,自动将剪切板的值输出到搜索框 Start =================== */
        // 监听粘贴事件
    document.addEventListener('paste', function(evt) {
        var clipdata = evt.clipboardData || window.clipboardData;
        // 判断是否已手动点击搜索框,是的话不进行自动赋值,反之自动赋值
        if (!isFocus()) {
            // 按Ctrl + V快捷键搜索框粘贴剪切板内容
            $('.searchInputL').val('"' + clipdata.getData('text/plain') + '"');
            // console.log(clipdata.getData('text/plain'));
            // 拼接url搜索地址
            var toUrlStr = 'https://bangumi.tv/subject_search/' + document.querySelectorAll('.searchInputL')[0].value + '?cat=';
            // 跳转页面
            window.open(toUrlStr + getQueryVariable('cat'), "_self");
        }
    });
    // 搜索框设置ID
    $('.searchInputL').attr('id', 'inputId');
    // 判断获取页面input焦点事件
    function isFocus() {
        // 判断是否获取到焦点
        var flag = false;
        // 判断是否有ID
        if (document.activeElement.id == 'inputId') {
            flag = true;
        }
        return flag;
    }
    /* ================== 监听按下Ctrl + V粘贴键,自动将剪切板的值输出到搜索框 End =================== */
})();