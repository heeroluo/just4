import { AliyunOSSProcessParser } from '@/aliyun/aliyun-parser';


const result = AliyunOSSProcessParser.parse('https://liveimages.videocc.net/uploadimage/20210423/chat_img_263338_16191908951549.jpeg?x-oss-process=image/crop,x_62,y_0,w_375,h_375/resize,w_300,limit_1/format,webp/quality,Q_80');
console.dir(result);
result?.setProcess('resize', {
  w: null,
  h: 300
});
console.log(result?.toString());
