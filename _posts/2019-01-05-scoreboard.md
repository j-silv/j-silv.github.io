---
title: "MTG electronic scoreboard"
description: Construction of a LED life point counter for the trading card game Magic The Gathering. Features include rapid point cycling capability and a scrolling endgame message 
date: 2019-01-05 11:33:00 +0800
categories: [Electronics]
tags: [arduino, c, 'cpp']
pin: true
media_subpath: /assets/img/scoreboard
image:
  path: /game.jpg
  alt: Game preview
---

[![GitHub last commit](https://img.shields.io/github/last-commit/j-silv/MTG-electronic-scoreboard?style=for-the-badge&logo=github&color=black
)](https://github.com/j-silv/MTG-electronic-scoreboard)


## Preview

{% include embed/youtube.html id='110aD0rj7Jw' %}

## Introduction

The date is December 14, 2018. A few weeks prior, I had discovered the open-source electronics platform Arduino and promptly bought a "starter kit". After enthusiastically working through its accompanying tutorials, I decided to start my own project: an electronic scoreboard for the trading card game Magic: The Gathering. I credit my best friend Scott for the idea, who suggested that an electronic life point counter would be a nice addition to our friendly matches.

## Concept

The principle of the device is fairly straightforward. A 4-digit 7-segment LED display will be "divided" into two 2-digit displays: one for Player 1, and the other for Player 2. Each player will have two buttons for increasing or decreasing his/her life points in the game.

![Device concept](ledbuttons.PNG)

To keep things interesting, I decided to implement some additional features:

- Rapid life point changing when holding down the buttons for a prolonged amount of time
- An endgame "losing" message for the first player to reach zero life points (the game is over at this point)

## Plan of attack

I divided my work into three main sections:

- Circuit design, gathering of components
- Programming of the device
- Soldering of the individual components on perfboard and 3D printing the device's enclosure


## Circuit

![Counter schematic](counterschema.PNG)

The circuit works as follows:

1. Firstly, the binary code necessary to display a certain number or letter on one of the LED digits is sent as serial data from the Arduino Nano to the 74HC595N shift register.
2. With appropriate clock pulsing for the shift and storage registers, the code representing which segments will be turned on is found on the parallel outputs of the shift register (QA-QH).
3. Depending on which digit is to be displayed, the corresponding base of the connected transistor to that digit's cathode is turned on to allow current to flow from the collector to the emitter. Resistors are sandwiched between the digital pins and the transistors' base to limit current flow.
4. In order to detect an increase or decrease of life points for one of the players, digital pins 9, 10, 11, and 12 are all pulled HIGH with internal pull-up resistors. Once one of the buttons is pushed, the connected digital pin is pulled LOW, thus triggering a program function.

## Coding

### Displaying each digit separately – Fooling our eyes

To successfully display different numbers for each digit, I took advantage of the persistence of vision. By rapidly turning on and off each digit with its corresponding value one by one, the viewer is fooled into thinking that all the digits of the display are on at the same time (our eye's simply can't keep up with the frequency of the flickering).

Thanks to Arduino's shiftOut function, the shift register could output appropriate LED segment data to display values for each digit.

```c
//LED display pins
const byte Digit1 = 2;
const byte Digit2 = 3;
const byte Digit3 = 4;
const byte Digit4 = 5;

//Shift register pins
const byte data=8;
const byte latch=7;
const byte clock=6;

//Starting life points 
unsigned int ValueDigit1 = 2;
unsigned int ValueDigit2 = 0;
unsigned int ValueDigit3 = 2;
unsigned int ValueDigit4 = 0;

//Turn off display
void DigitsOff(){             
  digitalWrite(Digit1,LOW);
  digitalWrite(Digit2,LOW);
  digitalWrite(Digit3,LOW);
  digitalWrite(Digit4,LOW);
}

//Set shift register output to appropiate number binary value 
void Display(unsigned char num)   
{
  digitalWrite(latch,LOW);                   //push in serial data
  shiftOut(data,clock,MSBFIRST,table[num]);  //table[] contains all the binary representations of the numbers
  digitalWrite(latch,HIGH);                  //latch data on parallel outputs
}

void Digit1Flash(){
  DigitsOff();
  Display(ValueDigit1);
  digitalWrite(Digit1,HIGH);  
  delay(vision); 
}

void Digit2Flash(){
  DigitsOff();
  Display(ValueDigit2);
  digitalWrite(Digit2,HIGH);  
  delay(vision); 
}

void Digit3Flash(){
  DigitsOff();
  Display(ValueDigit3);
  digitalWrite(Digit3,HIGH);  
  delay(vision); 
}

void Digit4Flash(){
  DigitsOff();
  Display(ValueDigit4);
  digitalWrite(Digit4,HIGH);  
  delay(vision); 
}

void setup() {
  pinMode(latch,OUTPUT);
  pinMode(clock,OUTPUT);
  pinMode(data,OUTPUT);
  pinMode(Digit1,OUTPUT);
  pinMode(Digit2,OUTPUT);
  pinMode(Digit3,OUTPUT);
  pinMode(Digit4,OUTPUT);
}

void loop() {
  Digit1Flash();
  Digit2Flash();
  Digit3Flash();
  Digit4Flash();
}
```

## Increasing/decreasing life points

Next is coding the adjustment of life points triggered by the buttons (the following example concerns Player 1 or button "left" but is identical to the program for Player 2 or button "right"). The coding for this quickly became complicated. The main issue resulted from "switch bouncing". Once one the button's was pushed, there was momentary on and off contact between the switch's terminals resulting in superfluous life points being added or subtracted from a single button push. To circumvent this problem, I relied on the microcontroller's internal clock and the Arduino function: millis() to "delay" the execution of certain pieces of code.

Included in this section is also the supplemental features of fast increasing/decreasing of life points. The corresponding functions rely also on predefined time intervals as well as Boolean statements for execution. The complexity of the code results from the fact the button can be:

Pushed once and let go before going to fast switching mode
Pushed once and held down to going into fast switching mode
Held down in fast switching mode
Let go in fast switching mode

Thus, having the correct placement of the Boolean statements as well as the appropriate timers defining the delay of execution was crucial. My solution might not be super elegant, but hey… it works!

```c
//Button pins
const byte UpLeft=9;
const byte DownLeft=10;
const byte UpRight=11;
const byte DownRight=12;

//Time variables, interval definitions
unsigned long CurrentTimer;

unsigned long UpLeftTimer;
unsigned long UpLeftHeldTimer;
unsigned long IsUpLeftHeld;
const unsigned long UpLeftDelay=100;
const unsigned long UpLeftIsHeld=1000;
const unsigned long UpLeftFastDelay=60;

unsigned long DownLeftTimer;
unsigned long DownLeftHeldTimer;
unsigned long IsDownLeftHeld;
const unsigned long DownLeftDelay=100; 
const unsigned long DownLeftIsHeld=1000;
const unsigned long DownLeftFastDelay=60;


//Boolean functions for button states
bool UpLeftPressed=false;
bool UpLeftFastGo=false;
bool UpLeftNotHeld=false;
bool UpLeftHeld=false;

bool DownLeftPressed=false;
bool DownLeftFastGo=false;
bool DownLeftNotHeld=false;
bool DownLeftHeld=false;

//Increase the LPs 
void GoUpLeft()
{ //concerns when LPs are at 09, 19, 29, etc.
  if( ValueDigit2==9 && ValueDigit1 !=9 ) //Value can't go past 99 (since that requires 3 digits)
  {
    ValueDigit1+=1;
    ValueDigit2=0;
  }
  else
  {
  //otherwise simply increase the number
  if(ValueDigit2<9) 
  {
    ValueDigit2+=1;
  }
  }
}

//Decrease the LPs 
void GoDownLeft()
{ //concerns when LPs are at multiples of 10 --> 90, 80, 70, etc.
  if( ValueDigit2==0 && ValueDigit1 !=0 )//can't change at 00
  {
    ValueDigit1-=1;
    ValueDigit2=9;
  }
  else
  {
  //otherwise simply decrease the number
  if(ValueDigit2>0)
  {
    ValueDigit2-=1;
  }
  }
}

//---------------------------READING BUTTON + FAST SWITCHING CODE--------------------------//

//=====================IS THE UP LEFT BUTTON PUSHED?=======================// (HAPPENS ONCE AND ONCE ONLY)
void ReadUpLeft()     
{
  if  (  digitalRead(UpLeft) == LOW && UpLeftPressed == false && UpLeftFastGo ==false  )
  {
    UpLeftPressed = true;
    UpLeftTimer=CurrentTimer;
    UpLeftHeldTimer=CurrentTimer;
  }
}

//============THESE BELOW CAN'T BE DONE IF HOLDING DOWN UPLEFT BUTTON ===================//
void ReadUpLeftNotHeld()
{
  if (digitalRead(UpLeft) == HIGH && (UpLeftPressed)  )
  {
   UpLeftPressed = false;
   UpLeftNotHeld = true;
  }                                                                           
  else
  {
    return; 
  }
}

//===========WE HAVE OK FROM READUPLEFTNOTHELD NOW WE CAN GO NORMAL==============================//
void GoUpLeftNormal()
{
  if ( (UpLeftNotHeld) && (CurrentTimer - UpLeftTimer) >= UpLeftDelay )
  {
   GoUpLeft();
   UpLeftNotHeld=false;
  }
else
{
  return;
}
}

//================IF BUTTON IS NOT HELD LONG ENOUGH THIS CAN'T HAPPEN==============================// (YOU WILL NEVER GO UP LEFTFAST)
void ReadUpLeftHeld()
{
if  (  (UpLeftPressed) && (CurrentTimer - UpLeftHeldTimer) >= UpLeftIsHeld )
{
UpLeftPressed=false;
UpLeftFastGo=true;
UpLeftHeldTimer=CurrentTimer;
}

if (digitalRead(UpLeft) == HIGH )                //==============THIS CODE RESETS IT. IF WE HELD IT NOT LONG ENOUGH BACK TO SQUARE 1============//
{
  UpLeftPressed=false;
}

else
{
  return;
}
}


//================WE HAVE OK FROM READUPLEFTHELD NOW WE CAN GO FAST==============================//
void GoUpLeftFast()
{
if ( (UpLeftFastGo) && digitalRead(UpLeft) == LOW && (CurrentTimer - UpLeftHeldTimer) >= UpLeftFastDelay )

{
  GoUpLeft();
  UpLeftHeldTimer=CurrentTimer;
}

if (digitalRead(UpLeft) == HIGH)
  {
    UpLeftFastGo=false;
    UpLeftPressed=false;
  }

else
{
  return;
}
}


//=====================IS THE DOWN LEFT BUTTON PUSHED?=======================// (HAPPENS ONCE AND ONCE ONLY)
void ReadDownLeft()     
{
  if  (  digitalRead(DownLeft) == LOW && DownLeftPressed == false && DownLeftFastGo ==false  )
  {
    DownLeftPressed = true;
    DownLeftTimer=CurrentTimer;
    DownLeftHeldTimer=CurrentTimer;
  }
}


//============THESE BELOW CAN'T BE DONE IF HOLDING DOWN DOWNLEFT BUTTON ===================//
void ReadDownLeftNotHeld()
{
  if (digitalRead(DownLeft) == HIGH && (DownLeftPressed)  )
  {
   DownLeftPressed = false;
   DownLeftNotHeld = true;
  }                                                                           
  else
  {
    return; 
  }
}

//===========WE HAVE OK FROM READDOWNLEFTNOTHELD NOW WE CAN GO NORMAL==============================//
void GoDownLeftNormal()
{
  if ( (DownLeftNotHeld) && (CurrentTimer - DownLeftTimer) >= DownLeftDelay )
  {
   GoDownLeft();
   DownLeftNotHeld=false;
  }
else
{
  return;
}
}

//================IF BUTTON IS NOT HELD LONG ENOUGH THIS CAN'T HAPPEN==============================// (YOU WILL NEVER GO DOWN LEFTFAST)
void ReadDownLeftHeld()
{
if  (  (DownLeftPressed) && (CurrentTimer - DownLeftHeldTimer) >= DownLeftIsHeld )
{
DownLeftPressed=false;
DownLeftFastGo=true;
DownLeftHeldTimer=CurrentTimer;
}

if (digitalRead(DownLeft) == HIGH )                //==============THIS CODE RESETS IT. IF WE HELD IT NOT LONG ENOUGH BACK TO SQUARE 1============//
{
  DownLeftPressed=false;
}

else
{
  return;
}
}

//================WE HAVE OK FROM READDOWNLEFTHELD NOW WE CAN GO FAST==============================//
void GoDownLeftFast()
{
if ( (DownLeftFastGo) && digitalRead(DownLeft) == LOW && (CurrentTimer - DownLeftHeldTimer) >= DownLeftFastDelay )

{
  GoDownLeft();
  DownLeftHeldTimer=CurrentTimer;
}

if (digitalRead(DownLeft) == HIGH)
  {
    DownLeftFastGo=false;
    DownLeftPressed=false;
  }

else
{
  return;
}
}

//Using Arduino's internal resistors for button detection
void setup(){
  pinMode(UpLeft,INPUT_PULLUP);
  pinMode(DownLeft,INPUT_PULLUP);
  pinMode(UpRight,INPUT_PULLUP);
  pinMode(DownRight,INPUT_PULLUP); 
}

void loop(){
  //As this loops, we will have an updated clock
  CurrentTimer = millis(); 

  ReadUpLeft();
  ReadUpLeftNotHeld();
  ReadUpLeftHeld();
  GoUpLeftNormal();
  GoUpLeftFast();

  ReadDownLeft();
  ReadDownLeftNotHeld();
  ReadDownLeftHeld();
  GoDownLeftNormal();
  GoDownLeftFast();
}
```

## Losing game, scrolling text message

Now here's where things get… convoluted (as if they were not already). I decided that having a "scrolling" endgame message would be awesome. At the very least, it seemed more elegant than simply flashing "Player 1 loses" once Player 1 reached 0 life points, since this option would require parsing out the words over multiple LED flashes.

In the end, I succeeded, but not after spending a large amount of time troubleshooting a complex timing and Boolean variable system that I came up with. Here is a simple example to explain how it works.

- Assume that we want to scroll (to the left) the word "PIE" on the LED display. We start with displaying P in the 4th digit's place.
- The letter P has to be visible for a certain predefined amount of time (this is handled by the millis() function).
- Once the timer reaches the end of the time interval, the letter P switches places to the 3rd digit. Unfortunately, it is not possible to simultaneously display the letter "I" on the 4th digit due to the LED display's internal wiring. Thus, once again exploiting the human eye's frequency threshold, we rapidly turn on and off digit 3 and 4 so that "PI" becomes visible.
- At this point, the number of timers increases as we now have a new timer counting how quickly to change between digit 3 and 4 as well as when to shift "PI" down one to the left and add the letter "E".
- Thankfully, the following steps are similar to the previous ones. Once the time interval for flashing between "P" and "I" is up, "P" is pushed to digit 2, "I" to digit 3, and the new letter "E" to digit 4. Now we cycle through "PIE" on digit 2, 3, and 4 for a predefined interval of time.
- This process repeats itself until there are no more visible letters on the display.

The excessive number of timers and Boolean switches is partly for visibility and to avoid any of the LED states being accessed more than once (I was constantly getting confused as to which timer corresponded to which LED state for example). If we continue with the "PIE" example, the program had to never again flash "P" in digit 4 once it passed from there to digit 3, etc.

Here's the actual code. In terms of memory usage and complexity, there is definitely room for improvement. However, it does work and results in a scrolling message.


```c
//These are the decimal values for the binary representing
//each letter in the losing message: PLAYER # LOSES (1 or 2)
unsigned char FirstLetter=25;        
unsigned char SecondLetter=21;
unsigned char ThirdLetter=10;
unsigned char FourthLetter=59;
unsigned char FifthLetter=14;
unsigned char SixthLetter=53;
unsigned char SeventhLetter=35;
unsigned char EighthLetter;
unsigned char NinthLetter=35;
unsigned char TenthLetter=21;
unsigned char EleventhLetter=24;
unsigned char TwelfthLetter=28;
unsigned char ThirteenthLetter=14;
unsigned char FourteenthLetter=28;

//=============SCROLLING SWITCHES=================//
bool ___L1=false;
bool __L1L2=false;
bool _L1L2L3=false;
bool L1L2L3L4=false;
bool L2L3L4L5=false;
//etc. etc.


//==============INTERNAL SWITCHES=================//
bool __L1onL2 = false;
bool __L1L2on = false;
bool _L1onL2L3=false;
bool _L1L2onL3=false;
bool _L1L2L3on=false;
bool L1onL2L3L4=false;
bool L1L2onL3L4=false;
bool L1L2L3onL4=false;
bool L1L2L3L4on=false;
bool L2onL3L4L5=false;
bool L2L3onL4L5=false;
bool L2L3L4onL5=false;
bool L2L3L4L5on=false;
bool L3onL4L5L6=false;
bool L3L4onL5L6=false;
bool L3L4L5onL6=false;
bool L3L4L5L6on=false;
//etc. etc.

//=================LosingScreenGameOverTiming===============//

unsigned long DelayBetweenNumbers=2;
unsigned long DelayBetweenScrolling=300;

unsigned long __L1L2Timer;
unsigned long _L1L2L3Timer;
unsigned long L1L2L3L4Timer;
unsigned long L2L3L4L5Timer;
unsigned long L3L4L5L6Timer;
unsigned long L4L5L6L7Timer;
unsigned long L5L6L7L8Timer;
unsigned long L6L7L8L9Timer;
unsigned long L7L8L9L10Timer;
unsigned long L8L9L10_Timer;
unsigned long L9L10__Timer;
unsigned long L10___Timer;


unsigned long L8L9L10L11Timer;
unsigned long L9L10L11L12Timer;
unsigned long L10L11L12L13Timer;
unsigned long L11L12L13L14Timer;
unsigned long L12L13L14_Timer;
unsigned long L13L14__Timer;
unsigned long L14___Timer;

void EndOfGamePause()
{
if ( ValueDigit1 == 0 && ValueDigit2 == 0 )  
{
  DigitsOff();
  delay(3000);
  ___L1=true;
  EighthLetter=1;
}

if ( ValueDigit3 == 0 && ValueDigit4 == 0 )  
{
  DigitsOff();
  delay(3000);
  ___L1=true;
  EighthLetter=2;
}

}

void PlayerLose()
{ 
EndOfGamePause();
while ( (ValueDigit1 == 0 && ValueDigit2 == 0) || (ValueDigit3 == 0 && ValueDigit4 == 0) && (i < 5)  )
{  
CurrentTimer = millis();  

//==================___L1===========================//
if( (___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6)&& (!L4L5L6L7)&& (!L5L6L7L8) && (!L6L7L8L9) 
&& (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) )
{
 ValueDigit4Lose=FirstLetter;
 FlashDigit4();
 ___L1=false;
 __L1L2=true;
 __L1L2Timer=CurrentTimer;
}

//===========================__L1L2=========================//
if( (CurrentTimer-__L1L2Timer) >= DelayBetweenScrolling && (!___L1) && (__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6)&& (!L4L5L6L7) 
&& (!L5L6L7L8) && (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
 __L1L2=false;
 _L1L2L3=true;
 
__L1onL2 =true;
__L1L2on =false;
 
 __L1L2Timer=CurrentTimer;
 _L1L2L3Timer=CurrentTimer;
}

Flash__L1L2();


//===========================_L1L2L3=========================//
if( (CurrentTimer-_L1L2L3Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6) &&(!L4L5L6L7) && (!L5L6L7L8) 
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
__L1onL2 = false;
__L1L2on = false;

 _L1L2L3=false;
 L1L2L3L4=true;
 
_L1onL2L3=true;
_L1L2onL3=false;
_L1L2L3on=false;

 _L1L2L3Timer=CurrentTimer;
 L1L2L3L4Timer=CurrentTimer;
}

Flash_L1L2L3();

//===========================L1L2L3L4=========================//
if( (CurrentTimer-L1L2L3L4Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6) && (!L4L5L6L7) && (!L5L6L7L8)  
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
_L1onL2L3=false;
_L1L2onL3=false;
_L1L2L3on=false;

 L1L2L3L4=false;
 L2L3L4L5=true;
 
L1onL2L3L4=true;
L1L2onL3L4=false;
L1L2L3onL4=false;
L1L2L3L4on=false;

 L1L2L3L4Timer=CurrentTimer;
 L2L3L4L5Timer=CurrentTimer;
}

FlashL1L2L3L4();

//===========================L2L3L4L5=========================//
if( (CurrentTimer-L2L3L4L5Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (L2L3L4L5) && (!L3L4L5L6) &&(!L4L5L6L7) && (!L5L6L7L8) 
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
L1onL2L3L4=false;
L1L2onL3L4=false;
L1L2L3onL4=false;
L1L2L3L4on=false;


L2L3L4L5=false;
L3L4L5L6=true;
 
L2onL3L4L5=true;
L2L3onL4L5=false;
L2L3L4onL5=false;
L2L3L4L5on=false;

 L2L3L4L5Timer=CurrentTimer;
 L3L4L5L6Timer=CurrentTimer;
}
FlashL2L3L4L5();

//===========================L3L4L5L6=========================//
if( (CurrentTimer-L3L4L5L6Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (L3L4L5L6)&& (!L4L5L6L7) && (!L5L6L7L8) 
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
L2onL3L4L5=false;
L2L3onL4L5=false;
L2L3L4onL5=false;
L2L3L4L5on=false;

L3L4L5L6=false;
L4L5L6L7=true;
 
L3onL4L5L6=true;
L3L4onL5L6=false;
L3L4L5onL6=false;
L3L4L5L6on=false;



 L3L4L5L6Timer=CurrentTimer;
 L4L5L6L7Timer=CurrentTimer;
}

FlashL3L4L5L6();


//===========================L4L5L6L7=========================//
if( (CurrentTimer-L4L5L6L7Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6)&& (L4L5L6L7) && (!L5L6L7L8)
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
L3onL4L5L6=false;
L3L4onL5L6=false;
L3L4L5onL6=false;
L3L4L5L6on=false;

L4L5L6L7=false;
L5L6L7L8=true;
 
L4onL5L6L7=true;
L4L5onL6L7=false;
L4L5L6onL7=false;
L4L5L6L7on=false;

 L4L5L6L7Timer=CurrentTimer;
 L5L6L7L8Timer=CurrentTimer;
}

FlashL4L5L6L7();

//===========================L5L6L7L8=========================//
if( (CurrentTimer-L5L6L7L8Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6)&& (!L4L5L6L7) && (L5L6L7L8)
&& (!L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
L4onL5L6L7=false;
L4L5onL6L7=false;
L4L5L6onL7=false;
L4L5L6L7on=false;

L5L6L7L8=false;
L6L7L8L9=true;
 
L5onL6L7L8=true;
L5L6onL7L8=false;
L5L6L7onL8=false;
L5L6L7L8on=false;

 L5L6L7L8Timer=CurrentTimer;
 L6L7L8L9Timer=CurrentTimer;
}

FlashL5L6L7L8();

//===========================L6L7L8L9=========================//
if( (CurrentTimer-L6L7L8L9Timer) >= DelayBetweenScrolling && (!___L1) && (!__L1L2) && (!_L1L2L3) && (!L1L2L3L4) && (!L2L3L4L5) && (!L3L4L5L6)&& (!L4L5L6L7) && (!L5L6L7L8)
&& (L6L7L8L9) && (!L7L8L9L10) && (!L8L9L10L11) && (!L9L10L11L12)&& (!L10L11L12L13)&& (!L11L12L13L14) && (!L12L13L14_) && (!L13L14__) && (!L14___) ) 

{
L5onL6L7L8=false;
L5L6onL7L8=false;
L5L6L7onL8=false;
L5L6L7L8on=false;

L6L7L8L9=false;
L7L8L9L10=true;
 
L6onL7L8L9=true;
L6L7onL8L9=false;
L6L7L8onL9=false;
L6L7L8L9on=false;

 L6L7L8L9Timer=CurrentTimer;
 L7L8L9L10Timer=CurrentTimer;
}

FlashL6L7L8L9();

//etc. etc...
//^^this continues for all the LED states

void Flash__L1L2()
{
  if( (CurrentTimer-__L1L2Timer) >= DelayBetweenNumbers && (__L1onL2) && (!__L1L2on) )
{
  ValueDigit3Lose=FirstLetter;
  FlashDigit3();

  __L1L2Timer=CurrentTimer;

  __L1onL2=false;
  __L1L2on=true;
}

if( (CurrentTimer-__L1L2Timer) >= DelayBetweenNumbers && (!__L1onL2) && (__L1L2on) )
{
  ValueDigit4Lose=SecondLetter;
  FlashDigit4();

  __L1L2Timer=CurrentTimer;

  __L1onL2=true;
  __L1L2on=false;
}

}

void Flash_L1L2L3()
{
  if( (CurrentTimer-_L1L2L3Timer) >= DelayBetweenNumbers && (_L1onL2L3) && (!_L1L2onL3) && (!_L1L2L3on) )
{
  ValueDigit2Lose=FirstLetter;
  FlashDigit2();

  _L1L2L3Timer=CurrentTimer;

  _L1onL2L3=false;
  _L1L2onL3=true;
  _L1L2L3on=false;
}

if( (CurrentTimer-_L1L2L3Timer) >= DelayBetweenNumbers && (!_L1onL2L3) && (_L1L2onL3) && (!_L1L2L3on) )
{
  ValueDigit3Lose=SecondLetter;
  FlashDigit3();

  _L1L2L3Timer=CurrentTimer;

  _L1onL2L3=false;
  _L1L2onL3=false;
  _L1L2L3on=true;
}

if( (CurrentTimer-_L1L2L3Timer) >= DelayBetweenNumbers && (!_L1onL2L3) && (!_L1L2onL3) && (_L1L2L3on) )
{
  ValueDigit4Lose=ThirdLetter;
  FlashDigit4();

  _L1L2L3Timer=CurrentTimer;

  _L1onL2L3=true;
  _L1L2onL3=false;
  _L1L2L3on=false;
}

}

void FlashL1L2L3L4()
{
  if( (CurrentTimer-L1L2L3L4Timer) >= DelayBetweenNumbers && (L1onL2L3L4) && (!L1L2onL3L4) && (!L1L2L3onL4) && (!L1L2L3L4on) )
{
  ValueDigit1Lose=FirstLetter;
  FlashDigit1();

  L1L2L3L4Timer=CurrentTimer;

  L1onL2L3L4=false;
  L1L2onL3L4=true;
  L1L2L3onL4=false;
  L1L2L3L4on=false;
}

if( (CurrentTimer-L1L2L3L4Timer) >= DelayBetweenNumbers && (!L1onL2L3L4) && (L1L2onL3L4) && (!L1L2L3onL4) && (!L1L2L3L4on) )
{
  ValueDigit2Lose=SecondLetter;
  FlashDigit2();

  L1L2L3L4Timer=CurrentTimer;

  L1onL2L3L4=false;
  L1L2onL3L4=false;
  L1L2L3onL4=true;
  L1L2L3L4on=false;
}

if( (CurrentTimer-L1L2L3L4Timer) >= DelayBetweenNumbers && (!L1onL2L3L4) && (!L1L2onL3L4) && (L1L2L3onL4) && (!L1L2L3L4on) )
{
  ValueDigit3Lose=ThirdLetter;
  FlashDigit3();

  L1L2L3L4Timer=CurrentTimer;

  L1onL2L3L4=false;
  L1L2onL3L4=false;
  L1L2L3onL4=false;
  L1L2L3L4on=true;
}

if( (CurrentTimer-L1L2L3L4Timer) >= DelayBetweenNumbers && (!L1onL2L3L4) && (!L1L2onL3L4) && (!L1L2L3onL4) && (L1L2L3L4on) )
{
  ValueDigit4Lose=FourthLetter;
  FlashDigit4();

  L1L2L3L4Timer=CurrentTimer;

  L1onL2L3L4=true;
  L1L2onL3L4=false;
  L1L2L3onL4=false;
  L1L2L3L4on=false;
}

}

//etc. etc...
//^^this continues for all the LED states

void loop(){
  PlayerLose();
}

```

## Soldering and 3D design

As the program worked with the components connected via a breadboard, it was time to finalize the electronic side of the project by soldering all the components together on a perfboard. For my first ever soldering job, I was pretty happy!

![Device enclosure](solder.jpg)

In terms of 3D design, I used Fusion 360 to design a 3D printable enclosure as well as a battery pack. I ended up not using my own battery pack since it added too much thickness to the overall design. Instead, I used a commercially available AA battery pack.

The design is made up of three separate parts that can be connected together with four screws:

- The main enclosure which has holes for a main power switch, a mini-B USB port for the Arduino Nano (just in case I ever wanted to update/change the program) and all the player buttons
- The second component is the battery pack which houses 4 AA batteries to power the Arduino
- The final piece is simply a lid that will cover the back of the soldered perfboard and create a closed structure

![Top piece](piece1.png)

![Back of top piece](piece1back.png)

![Battery pack](piece2.png)

![Back cover](piece3.png)

A huge thanks to the Innovation Hub at Florida State University for providing freely accessible electronic and mechanical equipment, as well as to their friendly staff!

## Final product

Some last-minute tasks included connecting a main power switch from the battery to the Arduino, hot gluing the circuit board to the inside of the 3D printed enclosure and adding red LED filter paper to facilitate the reading of the display. Here are some pictures and videos of the final result:

![Finished product](finished.jpg)

![Game](game.jpg)

{% include embed/youtube.html id='110aD0rj7Jw' %}

