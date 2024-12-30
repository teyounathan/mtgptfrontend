import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import gsap from 'gsap';
import { ApiService } from '../../../services/ApiService';
import { finalize } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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
        50% { transform: translateY(-5px); 
              
        }
      }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .scrollable::-webkit-scrollbar{
      display:none
    }

   
 
      textarea::-webkit-scrollbar {
    width: 8px;        /* Width of scrollbar */
  }

  textarea::-webkit-scrollbar-track {
    background: #000;  /* Background color of the scrollbar track */
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #fff;  /* Color of the scrollbar handle */
    border-radius: 4px;      /* Rounded corners */
  }


  `],

  
})
export class MainPageComponent {
  title = 'chatBot';
  showModal=false
  private MessageId:number|null=null
  constructor(private apiService:ApiService,private sanitizer: DomSanitizer){
    this.MessageId=Date.now()
  }
  showModalFunc(){
  }

  @ViewChild('Robot') private readonly Robot!: ElementRef;
  @ViewChild('scrollable') private readonly scrollable!: ElementRef;

  @ViewChild('messageContainer') private readonly messageContainer! :ElementRef
  @ViewChild('inputForm') private readonly inputForm! :ElementRef
  @ViewChild('RobotImage') private readonly RobotImage! :ElementRef
  @ViewChild("RobotMessage") private readonly RobotMessage!:ElementRef
  @ViewChild("list") private readonly list!:ElementRef
  @ViewChild("container")private readonly container!:ElementRef
  isLoading:boolean=false
  currentMessage: string = '';
  messages: ChatMessage[] = [];
  gsapTL:any=null
  robotPosition: 'center' | 'right' = 'center';
  rows=20

  ngAfterViewInit() {
    // Initialize box at center
    gsap.set(this.Robot.nativeElement, { x: 0 });
    gsap.set(this.RobotImage.nativeElement, { x: 0 });

    gsap.set(this.inputForm.nativeElement, { x: 0 });
    
   


  }
  formatContent(content: string): SafeHtml {

    content=this.removeTrailingSpaces(content)
    
    const formatters = [
      {
        // Inline code
        pattern: /`([^`]+)`/g,
        replacement: '<code class="bg-yellow-100 px-1 py-0.5 rounded font-mono">$1</code>'
      },
      {
        // Headings
        pattern: /^### (.+)$/gm,
        replacement: '<h3 class="text-lg font-semibold text-gray-800 mt-4">$1</h3>'
      },
      {
        // Tables
        pattern: /\|(?:.*?\|)+\n\|(?:-+\|)+\n((?:\|.*?\|.*?\n)+)/g,
        handler: (match: string) => {
          const [header, _, ...bodyRows] = match.trim().split('\n');
          
          const formatCells = (row: string, cellType: 'th' | 'td') => {
            const cells = row.split('|')
              .map(col => col.trim())
              .filter(Boolean)
              .map(col => `<${cellType} class="px-4 py-2 text-sm ${
                cellType === 'th' ? 'font-semibold text-gray-800' : 'text-gray-700'
              }">${col}</${cellType}>`);
            return cellType === 'td' ? `<tr class="border-b hover:bg-gray-50">${cells.join('')}</tr>` : cells.join('');
          };

          const tableHeaders = formatCells(header, 'th');
          const tableBody = bodyRows
            .filter(row => row.trim())
            .map(row => formatCells(row, 'td'))
            .join('');

          return `
            <div class="overflow-scroll">
              <table class="table-auto border-collapse border border-gray-300 w-full text-sm text-gray-700 bg-white shadow rounded-lg">
                <thead><tr>${tableHeaders}</tr></thead>
                <tbody>${tableBody}</tbody>
              </table>
            </div>`;
        }
      },
      {
        // Line breaks
        pattern: /(<br>\s*){2,}/g,
        replacement: '<br>'
      },
      {
        // Newlines
        pattern: /\n/g,
        replacement: '<br>'
      },
      {
        // Bullet points
        pattern: /(?:^|\n)([-*]) (.+)/g,
        replacement: '<li class="list-disc list-inside">$2</li>'
      }
    ];

    let formattedContent = content;
    
    formatters.forEach(formatter => {
      if (formatter.handler) {
        formattedContent = formattedContent.replace(formatter.pattern, formatter.handler);
      } else {
        formattedContent = formattedContent.replace(formatter.pattern, formatter.replacement);
      }
    });

    // Wrap bullet points in <ul>
    if (formattedContent.includes('<li>')) {
      formattedContent = formattedContent.replace(
        /(<li>.*<\/li>)/gs, 
        '<ul class="mt-2 ml-4">$1</ul>'
      );
    }
  
    return this.sanitizer.bypassSecurityTrustHtml(this.removeTrailingSpaces(formattedContent));
  } 
  
  
  private removeTrailingSpaces(content: string): string {
    return content
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .replace(/\s+$/g, '');
  }
  // trimeOutput(content:string){
    
  // }
  ngOnInit(){
    this.gsapTL=gsap.timeline()
  }

  scrollToBottom(){
    const div= this.messageContainer.nativeElement
    div.scrollTop=div.scrollHeight
  }

 
  moveToRight() {

    gsap.matchMedia().add("(min-width: 1024px)", () => {
      // Animations for devices with width >= 769px
    
      gsap.to(this.inputForm.nativeElement,{boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 0.8)",translateX:"25%",duration:1,translateY:"55%"})
      gsap.to(this.Robot.nativeElement, {boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 1)", width:"25vw",height:"70vh",left:"-10px",backgroundColor:"#000",padding:"10px",borderRadius:"20px",duration:1 });
      gsap.to(this.RobotImage.nativeElement,{width:"300px",display:"block",duration:1})

      gsap.to(this.RobotMessage.nativeElement,{opacity:1,display:"block",duration:1})
      gsap.to(this.container.nativeElement,{opacity:1,display:"block",duration:1,padding:10})
      gsap.to(this.list.nativeElement,{opacity:1,display:"flex",duration:1})


    },);

    gsap.matchMedia().add("(max-width: 1024px)", () => {
      // Animations for devices with width >= 769px
    
      gsap.to(this.inputForm.nativeElement,{boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 0.8)",transform:"translateX(0%)",duration:1,})
      gsap.to(this.Robot.nativeElement, {boxShadow:"0 35px 60px -15px rgba(0, 0, 0, 1)", width:"40vw",height:"70vh",left:"-10px",backgroundColor:"#000",padding:"10px",borderRadius:"20px",duration:1 });
      gsap.to(this.RobotImage.nativeElement,{width:"100px",margin:"auto",duration:1})
      gsap.to(this.RobotMessage.nativeElement,{opacity:1,display:"block",duration:1})
      gsap.to(this.list.nativeElement,{opacity:1,display:"flex",duration:1})
      gsap.to(this.container.nativeElement,{opacity:1,display:"block",duration:1})


    },);


    
 



  }
  ResetPosition() {
    gsap.to(this.inputForm.nativeElement,{boxShadow:"0px 0px 0px 0px ",transform:"translateX(0)",duration:1,})
    gsap.to(this.RobotImage.nativeElement,{width:"100vw",display:"",margin:"auto",duration:1})
    gsap.to(this.RobotMessage.nativeElement,{opacity:0,display:"hidden",duration:1})
    gsap.to(this.container.nativeElement,{opacity:0,display:"",duration:1})
    
    gsap.to(this.list.nativeElement,{opacity:0,display:"hidden",duration:1})
    
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
    this.rows=20
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
  addRow(event: KeyboardEvent){
    console.log(event.key)
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
     
        this.rows += 20;  // Increment height by 20 pixels

    
    }
    else if(event.key==="Backspace"){
        if(this.rows>20){
          this.rows-=20
        }
    }
  }
}

