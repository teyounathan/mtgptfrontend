import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import gsap from 'gsap';
import { ApiService } from '../../../services/ApiService';
import { finalize } from 'rxjs';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'MainPage',

  templateUrl: './mainPage-component.html',
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    .messageContainer::-webkit-scrollbar{
      display:none
    }
    .scrollable::-webkit-scrollbar{
      display:none
    }
  `],
  animations: [
    trigger('moveRobot', [
      state('center', 
        style({
        transform: 'translateX(0)'
      })),
      state('right', 
        style({
        transform: 'translateX(-30%)',
      })),
      transition('center => right', [animate('1s ease-in-out')]),
    ])
  ]
  
})
export class MainPageComponent {
  title = 'chatBot';
  showModal=false
  private MessageId:number|null=null
  constructor(private apiService:ApiService){
    this.MessageId=Date.now()
  }
  showModalFunc(){
    console.log("hey")
  }

  @ViewChild('Robot') private readonly Robot!: ElementRef;
  @ViewChild('scrollable') private readonly scrollable!: ElementRef;

  @ViewChild('messageContainer') private readonly messageContainer! :ElementRef
  @ViewChild('inputForm') private readonly inputForm! :ElementRef
  @ViewChild('RobotImage') private readonly RobotImage! :ElementRef
  @ViewChild("RobotMessage") private readonly RobotMessage!:ElementRef
  isLoading:boolean=false
  currentMessage: string = '';
  messages: ChatMessage[] = [];
  gsapTL:any=null
  robotPosition: 'center' | 'right' = 'center';

  ngAfterViewInit() {
    // Initialize box at center
    gsap.set(this.Robot.nativeElement, { x: 0 });
    gsap.set(this.RobotImage.nativeElement, { x: 0 });

    gsap.set(this.inputForm.nativeElement, { x: 0 });
    
   


  }
  ngOnInit(){
    this.gsapTL=gsap.timeline()
  }

  scrollToBottom(){
    const div= this.messageContainer.nativeElement
    div.scrollTop=div.scrollHeight
  }

 
  moveToRight() {

    gsap.matchMedia().add("(min-width: 1200px)", () => {
      // Animations for devices with width >= 769px
    
      gsap.to(this.inputForm.nativeElement,{boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 0.8)",transform:"translateX(25%)",duration:1,})
      gsap.to(this.Robot.nativeElement, {boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 1)", width:"25vw",height:"70vh",left:"-10px",backgroundColor:"#000",padding:"10px",borderRadius:"20px",duration:1 });
      gsap.to(this.RobotImage.nativeElement,{width:"300px",top:"80px",margin:"auto",duration:1,delay:1})
      gsap.to(this.RobotMessage.nativeElement,{opacity:1,display:"block",duration:1,delay:1.5})
    },);

    gsap.matchMedia().add("(max-width: 1200px)", () => {
      // Animations for devices with width >= 769px
    
      gsap.to(this.inputForm.nativeElement,{boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 0.8)",transform:"translateX(0%)",duration:1,})
      gsap.to(this.Robot.nativeElement, {boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 1)", width:"40vw",height:"70vh",left:"-10px",backgroundColor:"#000",padding:"10px",borderRadius:"20px",duration:1 });
      gsap.to(this.RobotImage.nativeElement,{width:"100px",top:"10px",margin:"auto",duration:1,delay:1})
      gsap.to(this.RobotMessage.nativeElement,{opacity:1,display:"block",duration:1,delay:1.5})
    },);


    
 



  }
  ResetPosition() {
    gsap.to(this.inputForm.nativeElement,{boxShadow:"0px 0px 0px 0px ",transform:"translateX(0)",duration:1,})
    gsap.to(this.RobotImage.nativeElement,{width:"500px",top:"0",margin:"auto",duration:1})
    gsap.to(this.RobotMessage.nativeElement,{opacity:0,display:"hidden",duration:1})
    
    gsap.to(this.Robot.nativeElement, { boxShadow:"0px 0px 0px 0px ", width:"100%",left:"0",backgroundColor:"transparent",padding:"0",borderRadius:"0",margin:"auto",duration:1 });

    
  }

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.robotPosition = 'right';
    
  
      
      // Add user message
      this.messages.push({
        content: this.currentMessage,
        isUser: true,
        timestamp: new Date()
      });

      // Move robot to right position
      if(this.messages.length){
          this.moveToRight()
      }

      if(this.MessageId){
        this.messages.push({
              content: '',
              isUser: false,
              timestamp: new Date()
            });

        this.makeFethRequest(this.currentMessage,this.MessageId)
      }


      // Simulate bot response
      // setTimeout(() => {
      //   this.scrollToBottom()
        
      //   this.messages.push({
      //     content: 'Thank you for your message. I am processing your request...',
      //     isUser: false,
      //     timestamp: new Date()
      //   });
      //   this.scrollToBottom()
      
      // }, 1000);
      setTimeout(() => this.scrollToBottom(), 0); 

      this.currentMessage = '';
    }
    
    
  }
  makeFethRequest(message:string,messageId:number){
    this.isLoading=true
    this.apiService.SendMessage(message,messageId).pipe(
      finalize(()=>{
        this.isLoading=false
      setTimeout(() => this.scrollToBottom(), 0); 

      })
      
    ).subscribe({
      next:(res)=>{
        let lastmessage=this.messages.pop()
        if(lastmessage){

          lastmessage.content=res.response
          this.messages.push(lastmessage)
      setTimeout(() => this.scrollToBottom(), 0); 

        
        }
      },
      error:(err)=>{
        console.log(err)
        let lastmessage=this.messages.pop()
        if(lastmessage){

          lastmessage.content="sorry there was an error with your request please try again"
          this.messages.push(lastmessage)
        
        }
        
      }
    })

  }
  emptyChat(){
    this.MessageId=Date.now()
    this.messages=[]
    this.ResetPosition()
    this.isLoading=false

  }
}

