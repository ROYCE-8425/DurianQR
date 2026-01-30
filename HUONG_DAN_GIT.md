# Hướng dẫn Làm việc Nhóm trên Git (DurianQR)

File này hướng dẫn cách bạn và team cùng làm việc, chia nhánh và đẩy code lên GitHub.

## 1. Đẩy dự án lên GitHub (Cho Bạn - Trưởng nhóm)

Do mình (AI) không có mật khẩu GitHub của bạn, bạn cần tự làm bước này 1 lần duy nhất:

1.  Vào [GitHub.com](https://github.com) -> Bấm **New Repository**.
2.  Đặt tên: `DurianQR` -> Chọn **Public**.
3.  Bấm **Create repository**.
4.  Copy dòng code ở phần **"…or push an existing repository from the command line"**. Nó sẽ trông như sau:

    ```bash
    git remote add origin https://github.com/USERNAME/DurianQR.git
    git branch -M main
    git push -u origin main
    ```

5.  Paste 3 dòng đó vào terminal (nơi đang chạy dự án) và Enter.

---

## 2. Quy trình "Tách Nhánh" (Branching) là gì?

Tưởng tượng cái cây:

- **Thân cây (Main)**: Là code chính, luôn chạy ổn định (giống bản bạn đang có).
- **Cành cây (Branch)**: Khi bạn hoặc bạn của bạn muốn làm tính năng mới (ví dụ: "Trang Báo Cáo"), đừng sửa trực tiếp vào Thân cây. Hãy mọc ra một cái Cành mới tên là `feature-report`.
- **Merge (Ghép cành)**: Sau khi làm xong trên Cành, test ok rồi, bạn mới "ghép" nó trở lại vào Thân.

**Lợi ích:** Nếu Cành bị lỗi, Thân cây vẫn sống khỏe. Code của người này không đè lên code người kia.

---

## 3. Các lệnh Git cơ bản cho Team

### Bước 1: Người mới (Bạn của bạn) tham gia dự án

1.  Mở Antigravity (hoặc VS Code).
2.  Mở **Terminal** (Ctrl + `).
3.  Gõ lệnh này để tải dự án về:
    ```bash
    git clone https://github.com/ROYCE-8425/DurianQR.git
    ```
4.  Gõ lệnh này để vào thư mục dự án:

    ```bash
    code DurianQR
    ```

    _(Hoặc vào menu File > Open Folder > Chon thư mục DurianQR vừa tải về)_.

5.  Cài đặt thư viện (chỉ cần làm 1 lần):
    - Mở terminal `frontend`: `cd frontend` -> `npm install`
    - Mở terminal `backend`: `cd backend` -> `dotnet restore`

### Bước 2: Bắt đầu làm việc (Mỗi ngày)

Trước khi code, hãy lấy code mới nhất từ Main về:

```bash
git checkout main
git pull origin main
```

### Bước 3: Tách nhánh để code

Ví dụ bạn muốn làm chức năng Login:

```bash
git checkout -b feature-login  # Tạo nhánh tên feature-login và chuyển qua đó
```

_Lúc này bạn cứ sửa file, code thoải mái, không ảnh hưởng gì đến Main cả._

### Bước 4: Lưu code (Commit)

Làm xong 1 phần thì lưu lại:

```bash
git add .
git commit -m "Đã làm xong form login"
```

### Bước 5: Đẩy nhánh lên GitHub

```bash
git push origin feature-login
```

### Bước 6: Merge (Ghép code)

1.  Vào trang GitHub của dự án.
2.  Bạn sẽ thấy nút **"Compare & pull request"**. Bấm vào đó.
3.  Xem lại code lần nữa rồi bấm **Merge pull request**.
    -> Code từ nhánh `feature-login` sẽ được gộp vào `main`.

---

## Tóm tắt quy trình 4 bước thần thánh:

4.  `git push` (Đẩy lên mạng)

---

## 4. Cách cấp quyền cho bạn bè (Quan Trọng)

Để bạn của bạn có thể đẩy code (`git push`) lên được, bạn cần thêm họ làm **Collaborator**:

1.  Vào trang GitHub Repo của bạn: `https://github.com/ROYCE-8425/DurianQR`
2.  Bấm vào tab **Settings** (bánh răng) phía trên cùng bên phải.
3.  Ở menu bên trái, chọn **Collaborators**.
4.  Bấm nút **Add people**.
5.  Nhập tên GitHub hoặc Email của bạn bạn vào đây.
6.  GitHub sẽ gửi một email mời cho họ -> Bảo họ vào email bấm "Accept Invitation" là xong!

_Lưu ý: Nếu không làm bước này, họ chỉ xem được code chứ không sửa (push) được nhé!_
