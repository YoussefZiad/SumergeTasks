package com.example.exception;

public class InvalidOperationException extends Exception{

    public InvalidOperationException(){
        super();
    }

    public InvalidOperationException(String message){
        super(message);
    }

}
