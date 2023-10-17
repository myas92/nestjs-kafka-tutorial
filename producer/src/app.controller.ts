import {Controller, Get, Post,Body, Inject, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy{
  constructor(
    private readonly appService: AppService,
    @Inject('any_name_i_want') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['medium.rocks','insert-message'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-test')
  testKafka(){
    return this.client.emit('medium.rocks', {foo:'bar', data: new Date().toString()})
  }


  @Get('kafka-test-with-response')
  testKafkaWithResponse(){
    return this.client.send('medium.rocks', {foo:'bar', data: new Date().toString()})
  }

  @Post('insert-message')
  InsertMessage(@Body() body){
    try{
      console.log(body)
      return this.client.emit('insert-message', {body, data: new Date().toString()})
    }catch(err){
      console.log(err)
    }
  }


}
