/*
[rewrite_local]
# ～ filebox unlock
^https?:\/\/api\.revenuecat\.com\/v\d\/subscribers\/(\$RCAnonymousID\%)?(\w)+$ url script-echo-response https://raw.githubusercontent.com/zhutou3/js/master/Scripts/fb1.js
^https?:\/\/api\.revenuecat\.com\/v\d\/receipts$ url script-echo-response https://raw.githubusercontent.com/zhutou3/js/master/Scripts/fb1.js
[mitm] 
hostname = api.revenuecat.com
*/

var zhutou3={"request_date": "2020-06-05T11:54:41Z", "request_date_ms": 1591358081473, "subscriber": {"entitlements": {"filebox_pro": {"expires_date": "2030-02-18T07:52:54Z", "product_identifier": "com.premium.yearly", "purchase_date": "2020-02-11T07:52:54Z"}}, "first_seen": "2020-05-29T07:59:41Z", "last_seen": "2020-06-05T11:46:28Z", "management_url": null, "non_subscriptions": {}, "original_app_user_id": "RbhyxwVVYSgnnUEtme2444PjccJ3", "original_application_version": "5", "original_purchase_date": "2020-05-29T07:47:32Z", "other_purchases": {}, "subscriptions": {"com.premium.yearly": {"billing_issues_detected_at": null, "expires_date": "2030-02-18T07:52:54Z", "is_sandbox": false, "original_purchase_date": "2020-02-11T07:52:55Z", "period_type": "normal", "purchase_date": "2020-02-11T07:52:54Z", "store": "app_store", "unsubscribe_detected_at": null}}}};
$done({body : JSON.stringify(zhutou3)});
