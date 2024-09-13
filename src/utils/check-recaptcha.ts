import { ForbiddenException } from '@nestjs/common';
import axios from 'axios';


export const checkRecaptcha = async (captcha: any) => {
	// default is test key, always return true
	
	const serviceKey = process.env.RECAPTCHA_KEY_SERVICE ?? '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; 
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${serviceKey}`;

  const { data } = await axios.post(recaptchaUrl);
  if (!data.success) {
    throw new ForbiddenException('Error validating captcha');
  }
};
