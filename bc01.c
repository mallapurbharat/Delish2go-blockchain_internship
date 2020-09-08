#include<stdio.h>
#include<stdlib.h>


struct node{		
	float data;
	struct node *next;
	struct node *prev;
};

typedef struct node dll;

dll *firstnode,*head,*tail,*temp,*nn;

void init(){
	
	firstnode=(dll*)malloc(sizeof(dll));
	
	firstnode->data=0;
	firstnode->prev=NULL;
	firstnode->next=NULL;
	
	head=firstnode;
	tail=firstnode;
	temp=firstnode;

}

dll* newNode(float data){
    dll* temp = (dll*) malloc(sizeof(dll));
    temp->data = data;
    temp->prev = NULL;
    temp->next = NULL;

    return temp;
}

void display(){
    dll* node = head;
    while (node)
    {
        printf("%f ", node->data);
        node = node->next;
    }
    
}

dll* search(float data){
    dll* node = head;
    while (node){
        if(node->data==data)
            return node;
        node = node->next;
    }

    return NULL;
}

void insertBegin(float data){
    dll* temp = newNode(data);
    temp->next = head;
    head->prev = temp;
    head = temp;
}

void insertMiddle(float data){
    dll* node = head;

    if(!node->next)
        return;

    while(node->next){
        if(node->data <= data && node->next->data >= data)
            break;
        node = node->next;
    }

    if(!node->next){
        printf("\n Unable to insert\n");
        return;
    }
        

    dll* newnode = newNode(data);
    dll* temp = node->next;

    node->next = newnode;
    newnode->prev = node;
    newnode->next = temp;
    temp->prev = newnode;
}

void insertEnd(float data){
    dll* temp = newNode(data);
    tail->next = temp;
    temp->prev = tail;
    tail = temp;
}


void deleteBegin(){
   head = head->next;
   head->prev=NULL;
}

void deleteMiddle(float data){
   dll* node = search(data);

   if(!node)
     return;

   node->prev->next = node->next;
   node->next->prev = node->prev;

}


void deleteEnd(){
   tail = tail->prev;
   tail->next=NULL;
}



int main(){
	init();
    int option;

    do{
        printf("Choose an operation:");
        printf("\n\n1) insertBegin");
        printf("\n2) insertMiddle");
        printf("\n3) insertEnd");
        printf("\n4) deleteBegin");
        printf("\n5) deleteMiddle");
        printf("\n6) deleteEnd");
        printf("\n7) search");
        printf("\n8) display");
        printf("\n9) exit");
        
        
        float data;
        scanf("%d", &option);

        switch (option)
        {
        case 1:
            printf("Enter the data");
            scanf("%f", &data);
            insertBegin(data);
            break;

        case 2:
            printf("Enter the data");
            scanf("%f", &data);
            insertMiddle(data);
            break;

        case 3:
            printf("Enter the data");
            scanf("%f", &data);
            insertEnd(data);
            break;

        case 4:
            deleteBegin();
            break;

        case 5:
            printf("Enter the data");
            scanf("%f", &data);
            deleteMiddle(data);
            break;

        case 6:
            deleteEnd();
            break;

        case 7:
            printf("Enter the data");
            scanf("%f", &data);
            dll* temp = search(data);

            if(temp)
                printf("%f Found", data);
            else
                printf("%f Not Found", data);
            break;

        case 8:
            display();
            break;
        
    }
    }while (option!=9);
    
    
}