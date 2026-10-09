// Problem data for seedProblems.js.
// Every program reads from stdin and prints to stdout, which is how Judge0 runs them.

const problems = [
  // ---------------------------------------------------------------- LeetCode 1
  {
    title: "Two Sum",
    difficulty: "easy",
    tags: "array",
    description: String.raw`Given an array of integers nums and an integer target, find the two different positions whose values add up to target.

Exactly one valid pair exists, and you may not use the same element twice.

Input format:
- Line 1: n, the number of elements
- Line 2: n space-separated integers (the array)
- Line 3: the target

Output format:
- The two indices (0-based) in increasing order, separated by a space

Constraints:
- 2 <= n <= 10^4
- -10^9 <= nums[i], target <= 10^9
- Exactly one answer exists`,
    visibleTestCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "3\n3 2 4\n6", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
      { input: "2\n3 3\n6", output: "0 1", explanation: "The two 3s add up to 6." }
    ],
    hiddenTestCases: [
      { input: "5\n-1 -2 -3 -4 -5\n-8", output: "2 4" },
      { input: "6\n1 5 9 13 2 8\n21", output: "3 5" },
      { input: "4\n0 4 3 0\n0", output: "0 3" },
      { input: "2\n1000000000 -1000000000\n0", output: "0 1" }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: String.raw`#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    vector<int> ans = twoSum(nums, target);
    sort(ans.begin(), ans.end());
    for (int i = 0; i < (int)ans.size(); i++) cout << ans[i] << (i + 1 < (int)ans.size() ? " " : "\n");
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: String.raw`import java.util.*;

public class Main {
    static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        int[] ans = twoSum(nums, target);
        Arrays.sort(ans);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) sb.append(i > 0 ? " " : "").append(ans[i]);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: String.raw`function twoSum(nums, target) {
    // Write your code here
    return [];
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const target = data[1 + n];
const ans = twoSum(nums, target).sort((a, b) => a - b);
console.log(ans.join(' '));`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: String.raw`#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<long long, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        auto it = seen.find((long long)target - nums[i]);
        if (it != seen.end()) return {it->second, i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    vector<int> ans = twoSum(nums, target);
    sort(ans.begin(), ans.end());
    for (int i = 0; i < (int)ans.size(); i++) cout << ans[i] << (i + 1 < (int)ans.size() ? " " : "\n");
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: String.raw`import java.util.*;

public class Main {
    static int[] twoSum(int[] nums, int target) {
        Map<Long, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get((long) target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put((long) nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        int[] ans = twoSum(nums, target);
        Arrays.sort(ans);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) sb.append(i > 0 ? " " : "").append(ans[i]);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: String.raw`function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
    }
    return [];
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const target = data[1 + n];
const ans = twoSum(nums, target).sort((a, b) => a - b);
console.log(ans.join(' '));`
      }
    ]
  },

  // ---------------------------------------------------------------- LeetCode 53
  {
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: "dp",
    description: String.raw`Given an integer array nums, find the contiguous subarray (containing at least one element) with the largest sum, and print that sum.

Input format:
- Line 1: n, the number of elements
- Line 2: n space-separated integers

Output format:
- A single integer: the largest subarray sum

Constraints:
- 1 <= n <= 10^5
- -10^4 <= nums[i] <= 10^4`,
    visibleTestCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "The subarray [4, -1, 2, 1] has the largest sum, 6." },
      { input: "1\n1", output: "1", explanation: "The only subarray is [1]." },
      { input: "5\n5 4 -1 7 8", output: "23", explanation: "The whole array [5, 4, -1, 7, 8] sums to 23." }
    ],
    hiddenTestCases: [
      { input: "3\n-3 -1 -2", output: "-1" },
      { input: "6\n2 -1 2 3 4 -5", output: "10" },
      { input: "4\n-2 -3 4 -1", output: "4" },
      { input: "7\n1 2 3 -10 4 5 -1", output: "9" }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: String.raw`#include <bits/stdc++.h>
using namespace std;

long long maxSubArray(vector<int>& nums) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: String.raw`import java.util.*;

public class Main {
    static long maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(maxSubArray(nums));
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: String.raw`function maxSubArray(nums) {
    // Write your code here
    return 0;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
console.log(maxSubArray(nums));`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: String.raw`#include <bits/stdc++.h>
using namespace std;

long long maxSubArray(vector<int>& nums) {
    long long best = nums[0], cur = 0;
    for (int x : nums) {
        cur = max((long long)x, cur + x);
        best = max(best, cur);
    }
    return best;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: String.raw`import java.util.*;

public class Main {
    static long maxSubArray(int[] nums) {
        long best = nums[0], cur = 0;
        for (int x : nums) {
            cur = Math.max(x, cur + x);
            best = Math.max(best, cur);
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(maxSubArray(nums));
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: String.raw`function maxSubArray(nums) {
    let best = nums[0], cur = 0;
    for (const x of nums) {
        cur = Math.max(x, cur + x);
        best = Math.max(best, cur);
    }
    return best;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
console.log(maxSubArray(nums));`
      }
    ]
  },

  // ---------------------------------------------------------------- LeetCode 26
  {
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    tags: "array",
    description: String.raw`You are given an integer array nums sorted in non-decreasing order. Remove the duplicates in-place so that each unique value appears only once, keeping the original relative order.

Return k, the number of unique values. After your function runs, the first k positions of nums must hold the unique values in sorted order. What is left after position k does not matter.

Input format:
- Line 1: n, the number of elements
- Line 2: n space-separated integers in non-decreasing order

Output format:
- Line 1: k
- Line 2: the first k elements of nums, separated by spaces

Constraints:
- 1 <= n <= 3 * 10^4
- -100 <= nums[i] <= 100
- nums is sorted in non-decreasing order`,
    visibleTestCases: [
      { input: "3\n1 1 2", output: "2\n1 2", explanation: "There are 2 unique values, so k = 2 and the array starts with 1, 2." },
      { input: "10\n0 0 1 1 1 2 2 3 3 4", output: "5\n0 1 2 3 4", explanation: "The unique values are 0, 1, 2, 3, 4, so k = 5." }
    ],
    hiddenTestCases: [
      { input: "1\n7", output: "1\n7" },
      { input: "5\n-3 -3 -3 -3 -3", output: "1\n-3" },
      { input: "6\n-1 0 1 2 3 4", output: "6\n-1 0 1 2 3 4" },
      { input: "7\n1 1 2 2 2 3 5", output: "4\n1 2 3 5" }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: String.raw`#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& nums) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int k = removeDuplicates(nums);
    cout << k << "\n";
    for (int i = 0; i < k; i++) cout << nums[i] << (i + 1 < k ? " " : "");
    cout << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: String.raw`import java.util.*;

public class Main {
    static int removeDuplicates(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int k = removeDuplicates(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i > 0 ? " " : "").append(nums[i]);
        System.out.println(k);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: String.raw`function removeDuplicates(nums) {
    // Write your code here
    return 0;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const k = removeDuplicates(nums);
console.log(k);
console.log(nums.slice(0, k).join(' '));`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: String.raw`#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& nums) {
    int k = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (k == 0 || nums[i] != nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int k = removeDuplicates(nums);
    cout << k << "\n";
    for (int i = 0; i < k; i++) cout << nums[i] << (i + 1 < k ? " " : "");
    cout << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: String.raw`import java.util.*;

public class Main {
    static int removeDuplicates(int[] nums) {
        int k = 0;
        for (int i = 0; i < nums.length; i++) {
            if (k == 0 || nums[i] != nums[k - 1]) nums[k++] = nums[i];
        }
        return k;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int k = removeDuplicates(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i > 0 ? " " : "").append(nums[i]);
        System.out.println(k);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: String.raw`function removeDuplicates(nums) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (k === 0 || nums[i] !== nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const k = removeDuplicates(nums);
console.log(k);
console.log(nums.slice(0, k).join(' '));`
      }
    ]
  },

  // ---------------------------------------------------------------- LeetCode 189
  {
    title: "Rotate Array",
    difficulty: "medium",
    tags: "array",
    description: String.raw`Given an integer array nums, rotate it to the right by k steps. Each step moves the last element to the front. Try to do it in-place with O(1) extra space.

Input format:
- Line 1: n, the number of elements
- Line 2: n space-separated integers
- Line 3: k, the number of steps

Output format:
- The rotated array, separated by spaces

Constraints:
- 1 <= n <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^5`,
    visibleTestCases: [
      { input: "7\n1 2 3 4 5 6 7\n3", output: "5 6 7 1 2 3 4", explanation: "Rotate 1 step: 7 1 2 3 4 5 6. 2 steps: 6 7 1 2 3 4 5. 3 steps: 5 6 7 1 2 3 4." },
      { input: "4\n-1 -100 3 99\n2", output: "3 99 -1 -100", explanation: "Rotate 1 step: 99 -1 -100 3. 2 steps: 3 99 -1 -100." }
    ],
    hiddenTestCases: [
      { input: "1\n5\n10", output: "5" },
      { input: "3\n1 2 3\n3", output: "1 2 3" },
      { input: "5\n1 2 3 4 5\n7", output: "4 5 1 2 3" },
      { input: "6\n1 2 3 4 5 6\n0", output: "1 2 3 4 5 6" },
      { input: "2\n1 2\n1", output: "2 1" }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: String.raw`#include <bits/stdc++.h>
using namespace std;

void rotate(vector<int>& nums, int k) {
    // Write your code here
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int k;
    cin >> k;
    rotate(nums, k);
    for (int i = 0; i < n; i++) cout << nums[i] << (i + 1 < n ? " " : "\n");
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: String.raw`import java.util.*;

public class Main {
    static void rotate(int[] nums, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int k = sc.nextInt();
        rotate(nums, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(nums[i]);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: String.raw`function rotate(nums, k) {
    // Write your code here (modify nums in-place)
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const k = data[1 + n];
rotate(nums, k);
console.log(nums.join(' '));`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: String.raw`#include <bits/stdc++.h>
using namespace std;

void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int k;
    cin >> k;
    rotate(nums, k);
    for (int i = 0; i < n; i++) cout << nums[i] << (i + 1 < n ? " " : "\n");
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: String.raw`import java.util.*;

public class Main {
    static void reverse(int[] a, int l, int r) {
        while (l < r) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
            l++; r--;
        }
    }

    static void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int k = sc.nextInt();
        rotate(nums, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(nums[i]);
        System.out.println(sb);
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: String.raw`function reverse(a, l, r) {
    while (l < r) {
        const t = a[l]; a[l] = a[r]; a[r] = t;
        l++; r--;
    }
}

function rotate(nums, k) {
    const n = nums.length;
    k %= n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const n = data[0];
const nums = data.slice(1, 1 + n);
const k = data[1 + n];
rotate(nums, k);
console.log(nums.join(' '));`
      }
    ]
  },

  // ---------------------------------------------------------------- LeetCode 287
  {
    title: "Find the Duplicate Number",
    difficulty: "medium",
    tags: "array",
    description: String.raw`You are given an array nums of n + 1 integers where every value is in the range [1, n]. Exactly one value is repeated (it may appear more than twice). Find and print that value.

Try to solve it without modifying the array and using only O(1) extra space.

Input format:
- Line 1: m, the length of the array (m = n + 1)
- Line 2: m space-separated integers

Output format:
- The repeated value

Constraints:
- 1 <= n <= 10^5
- nums.length == n + 1
- 1 <= nums[i] <= n
- Exactly one value appears two or more times`,
    visibleTestCases: [
      { input: "5\n1 3 4 2 2", output: "2", explanation: "2 is the only value that appears more than once." },
      { input: "5\n3 1 3 4 2", output: "3", explanation: "3 appears twice." },
      { input: "5\n3 3 3 3 3", output: "3", explanation: "The repeated value can appear more than twice." }
    ],
    hiddenTestCases: [
      { input: "2\n1 1", output: "1" },
      { input: "6\n1 4 4 2 4 3", output: "4" },
      { input: "10\n9 8 7 6 5 4 3 2 1 9", output: "9" },
      { input: "3\n2 2 2", output: "2" }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: String.raw`#include <bits/stdc++.h>
using namespace std;

int findDuplicate(vector<int>& nums) {
    // Write your code here
    return 0;
}

int main() {
    int m;
    cin >> m;
    vector<int> nums(m);
    for (int i = 0; i < m; i++) cin >> nums[i];
    cout << findDuplicate(nums) << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: String.raw`import java.util.*;

public class Main {
    static int findDuplicate(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int[] nums = new int[m];
        for (int i = 0; i < m; i++) nums[i] = sc.nextInt();
        System.out.println(findDuplicate(nums));
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: String.raw`function findDuplicate(nums) {
    // Write your code here
    return 0;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const m = data[0];
const nums = data.slice(1, 1 + m);
console.log(findDuplicate(nums));`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: String.raw`#include <bits/stdc++.h>
using namespace std;

int findDuplicate(vector<int>& nums) {
    // Floyd's cycle detection: treat i -> nums[i] as a linked list
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}

int main() {
    int m;
    cin >> m;
    vector<int> nums(m);
    for (int i = 0; i < m; i++) cin >> nums[i];
    cout << findDuplicate(nums) << "\n";
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: String.raw`import java.util.*;

public class Main {
    static int findDuplicate(int[] nums) {
        // Floyd's cycle detection: treat i -> nums[i] as a linked list
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int[] nums = new int[m];
        for (int i = 0; i < m; i++) nums[i] = sc.nextInt();
        System.out.println(findDuplicate(nums));
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: String.raw`function findDuplicate(nums) {
    // Floyd's cycle detection: treat i -> nums[i] as a linked list
    let slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}

const data = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const m = data[0];
const nums = data.slice(1, 1 + m);
console.log(findDuplicate(nums));`
      }
    ]
  }
];

module.exports = problems;
