/*
// Sample code to perform I/O:
#include <stdio.h>

int main(){
	int num;
	scanf("%d", &num);              			// Reading input from STDIN
	printf("Input number is %d.\n", num);       // Writing output to STDOUT
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail
*/

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct node{
	int data;
	struct node* next;
};

typedef struct node Node;

Node *head=NULL, *tail=NULL;

Node* newNode(int data){
	Node* temp = (Node*)malloc(sizeof(Node));
	temp->data = data;
	temp->next = NULL;

	return temp;
}

void insert(int data){
	Node* newnode = newNode(data);
	
	if(head==NULL){
		head=tail=newnode;
		tail->next = head;
		return;
	}

	tail->next = newnode;
	tail = newnode;
	tail->next = head;
}

bool isPrime(int data){
	if(data==1)
		return false;

	for(int i=2; i<data; i++)
		if(data%i==0)
			return false;

	return true;
}

void deletePrime(int N){
	Node* temp = tail;


	for(int i=0; i<N; i++){
		if(isPrime(temp->next->data)){

			if(temp->next==head)
				head=temp->next->next;
			if(temp->next==tail){
				tail=temp;
				// tail->next = head;
			}
				

			temp->next = temp->next->next;
		}
		else
			temp = temp->next;
	}//while(temp!=tail);
}

void display(){
	Node* temp = head;

	do{
		printf("%d ", temp->data);
		temp = temp->next;
	}while(temp!=head);
}

int main(){
	int N,data;
	scanf("%d", &N);              			// Reading input from STDIN
	
	for(int i=0; i<N; i++){
		scanf("%d", &data);
		insert(data);
	}

	// display();
	deletePrime(N);
	display();
}
