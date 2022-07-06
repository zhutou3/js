/*
 *
脚本作者：Hausd0rff

*******************************
[rewrite_local]
# > FileBox
^https?:\/\/api\.revenuecat\.com\/v1\/(receipts|subscribers\/\$RCAnonymousID%3A\w{32})$ url script-response-body https://raw.githubusercontent.com/zhutou3/js/master/Scripts/fb2.js
[mitm] 
hostname = api.revenuecat.com
*
*
*/


var objc = JSON.parse($response.body);

    objc =
{
  "request_date_ms" : 1644807425219,
  "request_date" : "2022-02-14T02:57:05Z",
  "subscriber" : {
    "non_subscriptions" : {
      "filebox_pro" : [
        {
          "id" : "35cd5ede42",
          "is_sandbox" : false,
          "purchase_date" : "2022-02-13T10:28:11Z",
          "original_purchase_date" : "2022-02-13T10:28:11Z",
          "store" : "app_store"
        }
      ]
    },
    "first_seen" : "2022-02-13T10:30:14Z",
    "original_application_version" : "100",
    "other_purchases" : {
      "filebox_pro" : {
        "purchase_date" : "2022-02-13T10:28:11Z"
      }
    },
    "management_url" : null,
    "subscriptions" : {

    },
    "entitlements" : {
      "filebox_pro" : {
        "grace_period_expires_date" : null,
        "purchase_date" : "2022-02-13T10:28:11Z",
        "product_identifier" : "filebox_pro",
        "expires_date" : null
      }
    },
    "original_purchase_date" : "2022-02-02T22:54:45Z",
    "original_app_user_id" : "$RCAnonymousID:0ab3738daba94750bcd43d1c99adcf39",
    "last_seen" : "2022-02-13T10:30:14Z"
  }
};

$done({body : JSON.stringify(objc)});
