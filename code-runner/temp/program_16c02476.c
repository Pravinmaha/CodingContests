#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void refGenerateArray(int* arr, int n) {
    for (int i = 0; i < n; i++) {
        arr[i] = i + 1;
    }
}

void generateArray(int* arr, int n) {
    for(int i = 0; i < n; i++){
        arr[i] = i+1;
    }
}


int main() {
    char str[100];
    while (fgets(str, sizeof(str), stdin)) {
        int n = atoi(str);

        if (n < 1 || n > 100) {
            printf("Invalid TestCase %d \n", n);
            break;
        }

        int actualOutput[100];
        int expectedOutput[100];
        refGenerateArray(&expectedArray, n);
        generateArray(&actualOutput, n);


        printf("actualOutput=[");
        for (int i = 0; i < n; i++) {
            printf("%d", actualOutput[i]);
            if (i != n - 1) printf(", ");
        }
        printf("]\n");

        printf("expectedOutput=[");
        for (int i = 0; i < n; i++) {
            printf("%d", expectedOutput[i]);
            if (i != n - 1) printf(", ");
        }
        printf("]\n");
    }

    return 0;
}
