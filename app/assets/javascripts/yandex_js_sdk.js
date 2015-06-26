// custom YandexDisk sdk
YandexDisk = {
    checkPath: function(path, callback){
        $.ajax({
            url: "https://cloud-api.yandex.net/v1/disk/resources?path="+path,
            dataType: "json",
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'OAuth 42d4bcd830464a7396eb1a9b959f9146');
            },
            success: function(result) {
                callback(true);
            },
            error: function (xhr) {
                callback(xhr.status != 404);
            }
        });
    },
    createFolder: function(path, callback){
        $.ajax({
            url: "https://cloud-api.yandex.net/v1/disk/resources?path="+path,
            dataType: "json",
            type: 'PUT',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'OAuth 42d4bcd830464a7396eb1a9b959f9146');
            },
            success: function(result) {
                callback(result);
            },
            error: function (xhr) {
                console.log(xhr.status+' '+thrownError);
            }
        });
    }
};