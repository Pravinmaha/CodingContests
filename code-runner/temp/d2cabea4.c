#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int refMult(int a, int b) {
    return a*b;
}

int diff(int a, int b) {
     
}


int main() {
    char s1[100], s2[100];
    char result[10000] = "";

    while (1) {
        if (!fgets(s1, sizeof(s1), stdin)) break;
        if (strlen(s1) == 1) { // only newline
            printf("%s", result);
            return 0;
        }

        if (!fgets(s2, sizeof(s2), stdin)) break;

        int a = atoi(s1);
        int b = atoi(s2);

        if (a > -100 || a < 100) {
            strcat(result, "Invalid TestCase\n");
            printf("%s", result);
            return 0;
        }

        if (b > -100 || b < 100) {
            strcat(result, "Invalid TestCase\n");
            printf("%s", result);
            return 0;
        }

        char temp[100];
        sprintf(temp, "%d\n%d\n%d\n%d\n", a, b, mult(a, b), refMult(a, b));
        strcat(result, temp);
    }

    return 0;
}
