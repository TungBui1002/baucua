# Đề xuất tối ưu hóa hiệu suất cho index.html

## 1. Tối ưu hóa JavaScript

*   **Thay thế `document.getElementById` và `document.querySelector`:** Thay vì gọi các hàm này mỗi khi cần truy cập một phần tử, hãy lưu trữ các tham chiếu đến các phần tử này trong các biến và sử dụng các biến đó.

    Ví dụ:

    ```javascript
    const button = document.querySelector("button");
    const dice1 = document.getElementById("dice1");
    ```

*   **Sử dụng vòng lặp `for` thay vì `forEach`:** Trong một số trường hợp, vòng lặp `for` có thể nhanh hơn `forEach`.

    Ví dụ:

    ```javascript
    for (let i = 0; i < diceElements.length; i++) {
        diceElements[i].classList.add("rolling");
    }
    ```

*   **Minify và nén JavaScript:** Sử dụng các công cụ như UglifyJS hoặc Terser để giảm kích thước tệp JavaScript.

## 2. Tối ưu hóa CSS

*   **Minify CSS:** Sử dụng các công cụ như CSSNano để giảm kích thước tệp CSS.
*   **Loại bỏ các quy tắc trùng lặp:** Kiểm tra CSS để tìm các quy tắc trùng lặp và loại bỏ chúng.

## 3. Tối ưu hóa hình ảnh

*   **Sử dụng WebP:** Chuyển đổi hình ảnh sang định dạng WebP để giảm kích thước tệp.
*   **Lazy loading:** Sử dụng lazy loading cho hình ảnh để chỉ tải hình ảnh khi chúng hiển thị trên màn hình.

## 4. Tối ưu hóa thời gian tải trang

*   **Sử dụng CDN:** Sử dụng CDN để phân phối các tệp tĩnh như hình ảnh, CSS và JavaScript.
*   **Kích hoạt bộ nhớ cache của trình duyệt:** Đảm bảo bộ nhớ cache của trình duyệt được kích hoạt để các tệp tĩnh được lưu trữ trong bộ nhớ cache của trình duyệt.