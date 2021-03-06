﻿/**
Провайдер AnyBalance (http://any-balance-providers.googlecode.com)
*/

var g_headers = {
	'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Charset':'windows-1251,utf-8;q=0.7,*;q=0.3',
	'Accept-Language':'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
	'Connection':'keep-alive',
	'User-Agent':'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.187 Mobile Safari/534.11+'
};

function main(){
    var prefs = AnyBalance.getPreferences();
    var baseurl = 'http://bonus.transclass.ru/';
    AnyBalance.setDefaultCharset('utf-8'); 

	var html = AnyBalance.requestPost(baseurl + 'Account/LogOn?ReturnUrl=%2faccount%2fbalance', {
        LoginName:prefs.login,
        Password:prefs.password,
    }, g_headers); 

	html = AnyBalance.requestGet(baseurl + 'Account/Balance', g_headers);
	
    if(!/Account\/LogOff/i.test(html)){
        throw new AnyBalance.Error('Не удалось зайти в личный кабинет. Сайт изменен?');
    }
    var result = {success: true};
	getParam(html, result, 'total', /Общее количество заработанных баллов:[\s\S]*?ce>([\s\S]*?)</i, replaceTagsAndSpaces, parseBalance);
	getParam(html, result, 'balance', /Текущий баланс:[\s\S]*?ce>([\s\S]*?)</i, replaceTagsAndSpaces, parseBalance);
    getParam(html, result, 'fio', /Добро пожаловать,([\s\S]*?)\!/i, replaceTagsAndSpaces, html_entity_decode);

    AnyBalance.setResult(result);
}