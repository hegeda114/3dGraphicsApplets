export function binomialCoefficient(n, k) {
    // Source: https://www.geeksforgeeks.org/how-to-evaluate-binomial-coefficient-of-two-integers-n-and-k-in-javascript/
    // Checking if n and k are integer
    if (Number.isNaN(n) || Number.isNaN(k)) {
        return NaN;
    }

    if (k < 0 || k > n) {
        return 0;
    }

    if (k === 0 || k === n) {
        return 1;
    }

    if (k === 1 || k === n - 1) {
        return n;
    }

    let res = n;
    for (let i = 2; i <= k; i++) {
        res *= (n - i + 1) / i;
    }

    return Math.round(res);
}

export function bersnstein(n, k, t) {
    return binomialCoefficient(n, k) * Math.pow(1 - t, n - k) * Math.pow(t, k);
    // return (1 - t) * bersnstein(n - 1, k, t) + t * bersnstein(n - 1, k - 1, t);
}