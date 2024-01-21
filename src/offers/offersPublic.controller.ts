import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('/offers')
export class OffersPublicController {
  constructor(private readonly offers: OffersService) { }


  @Get('/search')
  async simpleSearch(@Query() query) {
    return await this.offers.searchOfferQuery(query.lang, query.title);
  }

  @Get('/freshOffers')
  async getFreshOffers(@Query('lang') lang) {
    console.log('algo')
    const response = await this.offers.getFreshOffers(lang);
    return response;
  }


  @Get('/cats')
  async getAllCats(@Query('lang') lang) {
    console.log(lang);
    return await this.offers.getCats(lang);
  }

  @Get('/get/:id')
  async getOfferById(@Param('id') id, @Query('lang') lang) {
    return await this.offers.getOfferByRegexp(id, lang || 'ru');
  }

  @Get('/:cat')
  async getOffersByCat(@Param('cat') cat: string, @Query('lang') lang: string) {
    try {
      const result = await this.offers.getAllActiveOffersByCat(lang, cat);
      return result;
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }


  @Get('/')
  async getAllActive(@Query('lang') lang, @Req() req) {
    try {
      console.log(lang);
      console.dir(JSON.stringify(req.cookies));
      const result = await this.offers.getAllActiveOffers(lang);
      return result;
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
