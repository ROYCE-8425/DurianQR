# 📚 DurianQR API Documentation

> **Base URL:** `http://localhost:5000/api` (Dev) | `https://trannhuy.online/api` (Prod)

---

## 🔐 Authentication

### Register

```http
POST /auth/register
```

| Field    | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| username | string | ✅       | Tên đăng nhập                    |
| password | string | ✅       | Mật khẩu                         |
| fullName | string | ✅       | Họ tên                           |
| phone    | string |          | Số điện thoại                    |
| email    | string |          | Email                            |
| role     | string |          | `Farmer` (default) hoặc `Trader` |

### Login

```http
POST /auth/login
```

| Field    | Type   | Required |
| -------- | ------ | -------- |
| username | string | ✅       |
| password | string | ✅       |

**Response:**

```json
{
  "userID": 1,
  "username": "farmer1",
  "fullName": "Nguyễn Văn A",
  "role": "Farmer"
}
```

---

## 👥 Users

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/users`               | Danh sách users           |
| GET    | `/users/{id}`          | Chi tiết user             |
| GET    | `/users/farmers`       | Danh sách nông dân        |
| GET    | `/users/traders`       | Danh sách thương lái      |
| GET    | `/users/{id}/farms`    | Farms của user            |
| GET    | `/users/{id}/requests` | Harvest requests của user |
| GET    | `/users/stats`         | Thống kê users            |
| PUT    | `/users/{id}`          | Cập nhật user             |
| PUT    | `/users/{id}/role`     | Đổi role                  |
| DELETE | `/users/{id}`          | Xóa user                  |

---

## 🌳 Farms

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | `/farms`            | Danh sách farms |
| GET    | `/farms/{id}`       | Chi tiết farm   |
| GET    | `/farms/{id}/trees` | Cây trong farm  |
| POST   | `/farms`            | Tạo farm mới    |
| PUT    | `/farms/{id}`       | Cập nhật farm   |
| DELETE | `/farms/{id}`       | Xóa farm        |

---

## 🌲 Trees

| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| GET    | `/trees`           | Danh sách cây   |
| GET    | `/trees/{id}`      | Chi tiết cây    |
| GET    | `/trees/{id}/logs` | Nhật ký của cây |
| POST   | `/trees`           | Thêm cây        |
| PUT    | `/trees/{id}`      | Cập nhật cây    |
| DELETE | `/trees/{id}`      | Xóa cây         |

---

## 📝 Farming Logs

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/farminglogs`               | Danh sách nhật ký |
| GET    | `/farminglogs/{id}`          | Chi tiết log      |
| GET    | `/farminglogs/tree/{treeId}` | Logs theo cây     |
| GET    | `/farminglogs/farm/{farmId}` | Logs theo farm    |
| POST   | `/farminglogs`               | Tạo log mới       |
| PUT    | `/farminglogs/{id}`          | Cập nhật log      |
| DELETE | `/farminglogs/{id}`          | Xóa log           |

### Create Farming Log

```http
POST /farminglogs
```

```json
{
  "treeId": 1,
  "logDate": "2026-02-03T10:00:00Z",
  "activityType": "Spraying",
  "description": "Phun thuốc trừ sâu",
  "chemicalUsed": "Abamectin",
  "dosageAmount": 50,
  "unit": "ml",
  "safetyDays": 14
}
```

**Activity Types:** `Spraying`, `Fertilizing`, `Watering`, `Pruning`, `Flowering`, `Other`

---

## 🍈 Harvest Requests

### Workflow: `Pending` → `Approved` → `CheckedIn` → `Completed`

| Method | Endpoint                               | Description           |
| ------ | -------------------------------------- | --------------------- |
| GET    | `/harvest-requests/check-phi/{treeId}` | ⚠️ Kiểm tra PHI       |
| POST   | `/harvest-requests`                    | Tạo yêu cầu thu hoạch |
| GET    | `/harvest-requests/my?userId=5`        | Yêu cầu của tôi       |
| GET    | `/harvest-requests/{id}`               | Chi tiết request      |
| GET    | `/harvest-requests/pending`            | Đang chờ nhập kho     |
| GET    | `/harvest-requests/completed`          | Đã hoàn thành         |
| PUT    | `/harvest-requests/{id}/checkin`       | Xác nhận nhập kho     |
| PUT    | `/harvest-requests/{id}/complete`      | Hoàn thành            |

### Check PHI Before Harvest

```http
GET /harvest-requests/check-phi/1?harvestDate=2026-02-15
```

**Response:**

```json
{
  "isSafe": false,
  "safeAfterDate": "2026-02-20",
  "daysUntilSafe": 5,
  "recentLogs": [...]
}
```

---

## 📦 Batches

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/batches`                  | Danh sách lô        |
| GET    | `/batches/{id}`             | Chi tiết lô         |
| GET    | `/batches/code/{code}`      | Tìm theo mã lô      |
| POST   | `/batches`                  | Tạo lô mới          |
| PUT    | `/batches/{id}`             | Cập nhật            |
| PUT    | `/batches/{id}/status`      | Đổi trạng thái      |
| POST   | `/batches/{id}/add-request` | Thêm request vào lô |
| DELETE | `/batches/{id}`             | Xóa lô              |

**Export Status:** `InWarehouse`, `Packed`, `Shipped`, `Delivered`

---

## 🏭 Warehouses

| Method | Endpoint                          | Description   |
| ------ | --------------------------------- | ------------- |
| GET    | `/warehouses`                     | Danh sách kho |
| GET    | `/warehouses/{id}`                | Chi tiết kho  |
| GET    | `/warehouses/{id}/batches`        | Lô trong kho  |
| GET    | `/warehouses/{id}/stats`          | Thống kê kho  |
| POST   | `/warehouses`                     | Tạo kho       |
| PUT    | `/warehouses/{id}`                | Cập nhật      |
| PUT    | `/warehouses/{id}/assign-manager` | Gán thủ kho   |
| DELETE | `/warehouses/{id}`                | Xóa kho       |

---

## 💊 Chemicals

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/chemicals`                | Danh sách thuốc |
| GET    | `/chemicals/{id}`           | Chi tiết        |
| GET    | `/chemicals/search?q=aba`   | Tìm kiếm        |
| GET    | `/chemicals/safe?market=CN` | Thuốc an toàn   |
| POST   | `/chemicals`                | Thêm thuốc      |
| PUT    | `/chemicals/{id}`           | Cập nhật        |
| POST   | `/chemicals/{id}/ban`       | Cấm thuốc       |
| POST   | `/chemicals/{id}/unban`     | Gỡ cấm          |
| DELETE | `/chemicals/{id}`           | Xóa             |

---

## 📱 QR Codes

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/qr/batch/{batchId}`       | Lấy QR cho lô   |
| GET    | `/qr/batch/{batchId}/image` | Ảnh QR (base64) |
| POST   | `/qr/generate/{batchId}`    | Tạo QR mới      |
| PUT    | `/qr/{qrId}/scan`           | Ghi nhận quét   |

---

## 🔍 Traceability (Public)

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| GET    | `/trace/{batchCode}`          | Truy xuất nguồn gốc |
| GET    | `/trace/{batchCode}/timeline` | Timeline canh tác   |
| GET    | `/trace/{batchCode}/verify`   | Xác thực sản phẩm   |

### Trace Response

```json
{
  "batch": { "batchCode": "BATCH-20260203-001", ... },
  "sources": [
    {
      "farmer": "Nguyễn Văn A",
      "farm": "Vườn An Phú",
      "tree": "AP-001",
      "harvestDate": "2026-02-01",
      "farmingLogs": [...]
    }
  ],
  "isSafe": true,
  "verifyUrl": "https://trannhuy.online/trace/BATCH-20260203-001"
}
```

---

## 📊 Error Codes

| Code | Message                            |
| ---- | ---------------------------------- |
| 400  | Bad Request - Dữ liệu không hợp lệ |
| 401  | Unauthorized - Chưa đăng nhập      |
| 403  | Forbidden - Không có quyền         |
| 404  | Not Found - Không tìm thấy         |
| 500  | Internal Error - Lỗi server        |

---

_Cập nhật: 03/02/2026_
