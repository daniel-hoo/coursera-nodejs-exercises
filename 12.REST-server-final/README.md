# REST API Final

- User Authentication with [Passport](https://www.passportjs.org/)
- [Mongoose Population](http://mongoosejs.com/docs/populate.html)
- HTTPS and Secure Communication<br>
运行以下命令，在 bin 文件夹下生成私钥和证书,然后在 www 中引用。
```
openssl genrsa 1024 > private.key
openssl req -new -key private.key -out cert.csr
openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```
- Using OAuth with Passport and Facebook<br>
在 [http://developers.facebook.com/apps/](http://developers.facebook.com/apps/) 注册应用，获得 App ID 和 App Secret，填入 config.js 中。