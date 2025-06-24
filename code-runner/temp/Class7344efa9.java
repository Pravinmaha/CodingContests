import java.util.*;
// REFERENCE_CODE
class Class7344efa9{
   public static void main(String[] args){
       Scanner sc = new Scanner(System.in);
       Solution s = new Solution();
       StringBuilder sb = new StringBuilder();
       String s1="", s2="";
       while(true){
           s1 = sc.nextLine();
           if(s1.trim().length() == 0) break;
           s2 = sc.nextLine();
           int a = Integer.parseInt(s1);
           int b = Integer.parseInt(s2);
           int sum = s.add(a, b);
           sb.append(a+"\n"+b"\n"+sum+"\n");
           
       }
       System.out.println(sb.toString());
   }
}