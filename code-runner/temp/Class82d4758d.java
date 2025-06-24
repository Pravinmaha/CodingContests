import java.util.Scanner;

class RefSolution{
    public int mult(int a, int b){
         return a*b;
    }
}
class Solution{
    public int mul(int a, int b){
         return ab;
    }
}

class Class82d4758d{
      public static void main(String[] args){
            Scanner sc = new Scanner(System.in);
            String s1="", s2="";
            RefSolution refs = new RefSolution();
            Solution s = new Solution();
            StringBuilder sb = new StringBuilder();
            while(true){
                if (!sc.hasNextLine()) break;
                 s1 = sc.nextLine();                 s2 = sc.nextLine();
                 int a = Integer.parseInt(s1);
                 int b = Integer.parseInt(s2);
                 if(a < -100 || a > 100){
                      sb.append("Invalid TestCase "+a+" "+b+"\n");
                      break;
                 }
                 if(b < -100 || b > 100){
                      sb.append("Invalid TestCase "+a+" "+b+"\n");
                      break;
                 }
                 int actualOutput = s.mult(a,b);
                 sb.append("actualOutput="+actualOutput+"\n");
                 int expectedOutput = refs.mult(a,b);
                 sb.append("expectedOutput="+expectedOutput+"\n");

            }
            System.out.println(sb.toString());
      }
}