---
title: "PC terminal to LCD communication device"
description: Use of a STM32 Arm Cortex microcontroller to build a communication device transferring text from a PC serial terminal to an external LCD screen
categories: [Electronics]
tags: [stm32, c] 
pin: False
media_subpath: /assets/img/pcserialcom
image:
  path: /example.jpg
  alt: PC serial output
---

[![GitHub last commit](https://img.shields.io/github/last-commit/j-silv/PC-terminal-to-LCD-communication-device?style=for-the-badge&logo=github&color=black
)](https://github.com/j-silv/PC-terminal-to-LCD-communication-device)

## Introduction

In an effort to further my knowledge in embedded systems, I decided to buy a STM32 ARM Cortex-M0 evaluation board and play around with it. As a first project, I set myself out to transfer text from a serial terminal on my laptop, to the STM32 microcontroller, and then finally out to an LCD screen peripheral. The goal here was not to accomplish something super fancy, but to develop and work on my embedded skills in preparation for more difficult endeavors.

## Concept

The microcontroller was coded in C with some help from ST's HAL libraries. The two main parts of this project were:

- Handling USART (serial communication) between the microcontroller and a serial port on my laptop
- Initializing and controlling the LCD peripheral

I imagined the user sending a variable length message (under a max byte limit) via a serial terminal, which would then be transmitted through the microcontroller's USART peripheral and stored to memory. Taking advantage of the ST-LINK interface and it's virtual com port on my STM32 Nucleo board, I was able to set up the USART by initializing USART RX/TX pins and configuring the protocol (baud rate, parity, etc.). This message would then be transferred character by character to an external LCD by accessing the LCD driver's data registers (write instruction) until the whole message was spelled out on the screen. Of course, an initialization sequence would be necessary for the LCD before being able to print any messages.

## Schematic

For this device, the schematic was quite simple. A 10 kΩ potentiometer was included for adjusting the LCD screen's contrast and the driver's data/control pins were connected to GPIO pins on the microcontroller. The STM32 provided power for the LCD module.

![Schematic](schema.PNG)

## Coding - serial communication

Moving on to the coding of the device, we first see the init_Terminal() function that sets up the serial terminal display and then prints out a prompt for the user. Next, we have readprint_Input() that does most of the heavy lifting. From the main loop, this function is called, which begins by nulling every character in the msg[] array (see next section regarding this). Next, with HAL_UART_Receive(), the function polls waiting for the user to send text via the serial terminal. When a message is being sent, every character is scanned and the reception stops once the ENTER key is detected. Each byte is placed into the msg[] array.

After that, a few more messages are sent from the STM32 back through the serial port before returning the pointer of the msg[] array to main(). Back in the infinite while loop, LCD_print() is called to display the message to the LCD.

```c
int main(void) {
  char *terminal_msg;

  //Peripheral reset
  HAL_Init();
  
  //System clock configuration
  SystemClock_Config();

  //Configure peripherals
  MX_GPIO_Init();
  MX_USART2_UART_Init();

  //Set up serial terminal
  init_Terminal();

  //Set up LCD screen
  LCD_init();

  while (1) {
    //Read then spit back serial terminal data
    terminal_msg = readprint_Input();

    //Print message to LCD
    LCD_print(terminal_msg);
  }
}



//Set up initial viewing for serial terminal
void init_Terminal(void) {

  char prompt[100];

  //Place text cursor at top left of terminal and clear the terminal
  HAL_UART_Transmit(&huart2, (uint8_t*)"\033[0;0H", strlen("\033[0;0H"), HAL_MAX_DELAY);
  HAL_UART_Transmit(&huart2, (uint8_t*)"\033[2J", strlen("\033[2J"), HAL_MAX_DELAY);

  //Print prompt
  sprintf(prompt,"%s","*******************************************************************************\r\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

  sprintf(prompt,"%s","**    SERIAL TERMINAL TO LCD SCREEN - STM32 ARM CORTEX-M0 MICROCONTROLLER    **\r\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

  sprintf(prompt,"%s","*******************************************************************************\r\n\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

  sprintf(prompt,"%s","Type your message and then press ENTER:\r\n\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

}

//Read text from serial terminal
char * readprint_Input(void) {

  char msg_byte[1], prompt[100];
  static char msg[MAX_MSG_SIZE]; //Static variable so we can return the message to main()
  uint8_t i;

  //Have to null array to 0 every time readprint_Input is called, otherwise previous msg appears
  for (i = 0; i < MAX_MSG_SIZE; i++) {
    msg[i] = '\0';
  }
  i = 0;

  do {
    //Polling for user to send text through serial terminal
    HAL_UART_Receive(&huart2, (uint8_t*)msg_byte, 1, HAL_MAX_DELAY);

    //If ENTER key is sent, don't add it to the text message
    if ((int)msg_byte[0] != '\r') {

      //Byte by byte, construct the text message
      msg[i]=msg_byte[0];
      i++;
    }

  } while ((int)msg_byte[0] != '\r'); //Stop receiving once ENTER key is sent

  //Spit back out what was transmitted
  sprintf(prompt,"%s","You entered: ");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);
  HAL_UART_Transmit(&huart2, (uint8_t*)(msg), strlen(msg), HAL_MAX_DELAY);
  sprintf(prompt,"%s","\r\n\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

  sprintf(prompt,"%s","Type your message and then press ENTER:\r\n\n");
  HAL_UART_Transmit(&huart2, (uint8_t*)prompt, strlen(prompt), HAL_MAX_DELAY);

  return msg;
}
```

## Issue - parts of previous text messages displayed 

I ran into an issue where the LCD would display fragments of previously sent text messages. At first, I wasn't sure why this was happening, but after switching to the debugger and instruction stepping mode of the IDE, I realized that every character of the msg[] array was being sent, not just the characters of the new string sent in by the user.

My solution was thus to ensure that the array was always initialized to 0 at the beginning of the readprint_Input() function call. My first attempt was to use the following:

```c
char msg[MAX_MSG_SIZE] = { 0 };
```

However, this didn't work because now the variable wasn't static. I was no longer able to return the message back to the main() function given the array's local visibility.

The final solution, which is seen in the above code, was to force every character of the array to '\0' at the beginning of the function call. There are perhaps sneakier ways to deal with this problem without having to step through every byte explicitly, but the overhead wasn't noticeable for my application and it solved the issue.

## Coding - LCD driver

Now on to the fun part: actually displaying the message sent via the serial terminal. The first function, LCD_init(), is called once from main() which initializes the LCD screen according to the driver's datasheet specifications. The driver's instruction register is then selected and the data lines are set to initialize the LCD with a particular configuration (2 line display, 5x8 pixel dots, etc.). Afterwards, data is written to the instruction register by pulsing the chip enable pin.

After initialization, the display is cleared and the serial message is printed, one character at a time (a pointer to the string passed in from main() is used). This requires selecting the data register of the KS0066 LCD driver and setting the corresponding data pins for representing the ASCII character.

```c
void LCD_init(void) {
  //Initialization instructions on pg. 26 of the ks0066 datasheet
  //Most delays are much longer than necessary - this is because HAL_Delay only takes in milliseconds
  //To improve time response, internal free-running counters can be used to get microsecond delays

  HAL_Delay(50);

  //FUNCTION SET
  HAL_GPIO_WritePin(RS_GPIO_Port, RS_Pin, GPIO_PIN_RESET);
  LCD_data_line = 0x30 | LCD_2LINE | LCD_5x8DOTS;
  write8bits(LCD_data_line);

  HAL_Delay(1);

  //DISPLAY ON/OFF CONTROL
  LCD_data_line = 0x8 | LCD_CURSOROFF | LCD_BLINKOFF | LCD_DISPLAYON;
  write8bits(LCD_data_line);

  HAL_Delay(1);

  //DISPLAY CLEAR
  LCD_clear();

  //ENTRY MODE SET
  LCD_data_line = 0x4 | LCD_ENTRYLEFT | ~LCD_ENTRYSHIFTINCREMENT;
  write8bits(LCD_data_line);

  HAL_Delay(1);
}

void write8bits(uint8_t data) {
  HAL_GPIO_WritePin(D0_GPIO_Port, D0_Pin, data & (0x1 << 0));
  HAL_GPIO_WritePin(D1_GPIO_Port, D1_Pin, data & (0x1 << 1));
  HAL_GPIO_WritePin(D2_GPIO_Port, D2_Pin, data & (0x1 << 2));
  HAL_GPIO_WritePin(D3_GPIO_Port, D3_Pin, data & (0x1 << 3));
  HAL_GPIO_WritePin(D4_GPIO_Port, D4_Pin, data & (0x1 << 4));
  HAL_GPIO_WritePin(D5_GPIO_Port, D5_Pin, data & (0x1 << 5));
  HAL_GPIO_WritePin(D6_GPIO_Port, D6_Pin, data & (0x1 << 6));
  HAL_GPIO_WritePin(D7_GPIO_Port, D7_Pin, data & (0x1 << 7));

  pulseEnable();
}


void pulseEnable(void) {
  HAL_GPIO_WritePin(E_GPIO_Port, E_Pin, GPIO_PIN_RESET);
  HAL_Delay(1);
  HAL_GPIO_WritePin(E_GPIO_Port, E_Pin, GPIO_PIN_SET);
  HAL_Delay(1);
  HAL_GPIO_WritePin(E_GPIO_Port, E_Pin, GPIO_PIN_RESET);
  HAL_Delay(1);
}


void LCD_print(char* text) {

  //Clear LCD before printing new message
  LCD_clear();

  //Print out 1 character at a time from the passed string
  for (uint8_t i = 0; i < strlen(text); i++) {

    //Set cursor to next line if cursor reaches end of the 1st row
    if (i == LCD_NUM_CHAR) {
      LCD_nextline();
    }

    //Select data register
    HAL_GPIO_WritePin(RS_GPIO_Port, RS_Pin, GPIO_PIN_SET);

    LCD_data_line = (uint8_t)text[i];
    write8bits(LCD_data_line);
  }
}


void LCD_clear(void) {
  //Select instruction register
  HAL_GPIO_WritePin(RS_GPIO_Port, RS_Pin, GPIO_PIN_RESET);

  LCD_data_line = LCD_CLEARDISPLAY;
  write8bits(LCD_data_line);
  HAL_Delay(2);
}


void LCD_nextline(void) {
  //Select instruction register
  HAL_GPIO_WritePin(RS_GPIO_Port, RS_Pin, GPIO_PIN_RESET);

  LCD_data_line = LCD_SETDDRAMADDR | LCD_2LINE_DDRAM_START;
  write8bits(LCD_data_line);
  HAL_Delay(1);
}
```

## Issue - displaying 1st and 2nd line characters

Another slight issue resulted from an address gap when in the 2-line display mode. The DDRAM of the LCD driver used addresses 00h-27h for the 1st line character information and addresses 40h-67h for the 2nd. My first solution was to read from the driver to know when address 27h was reached, then jumping to address 40h to resume printing. However, I realized that my uint8_t i counter was sufficient to know when to jump to the next line, since i would increment every time a new character was displayed (my LCD could display 16x1 characters, so once i = 16, it was time to jump). A simple set DDRAM address instruction could then be performed to print to the 2nd line.

## Conclusion

All in all, I really appreciated this project for several reasons:

- I gained valuable experience in setting up a USART communication protocol and handling data reception/transmission with a STM32 ARM cortex microcontroller
- I learned how to interface with a peripheral LCD driver and defined several high-level functions such as LCD_print() and LCD_clear() to allow for intuitive application coding
- I was confronted with several issues, leading me to debug the device and discover efficient solutions to the problems

Of course, this project could be ameliorated and built upon to implement more advanced features. Some ideas I had: having the LCD print out text files from the host PC one line at a time, or setting up a Wi-Fi connection so that inspirational quotes from the internet could be displayed.