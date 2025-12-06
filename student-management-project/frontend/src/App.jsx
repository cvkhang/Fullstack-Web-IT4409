import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    //Bài 1: 
    axios.get('http://localhost:5000/api/students')
      .then(res => {
        setStudents(res.data)
      })
      .catch(err => {
        console.error("Error fetching students:", err)
      })
  }, [])

  //Bài 2 & 3:
  const handleSubmit = (e) => {
    e.preventDefault()
    const studentData = { name, age: Number(age), class: stuClass }

    if (editingId) {
      // Update existing student
      axios.put(`http://localhost:5000/api/students/${editingId}`, studentData)
        .then(res => {
          console.log("Đã cập nhật:", res.data)
          setStudents(prev => prev.map(s => s._id === editingId ? res.data : s))
          resetForm()
        })
        .catch(err => console.error("Lỗi khi cập nhật:", err))
    } else {
      // Add new student
      axios.post('http://localhost:5000/api/students', studentData)
        .then(res => {
          console.log("Đã thêm:", res.data)
          setStudents(prev => [...prev, res.data])
          resetForm()
        })
        .catch(err => console.error("Lỗi khi thêm:", err))
    }
  }

  const handleEditClick = (student) => {
    setEditingId(student._id)
    setName(student.name)
    setAge(student.age)
    setStuClass(student.class)
  }

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setAge("")
    setStuClass("")
  }

  //Bài 4:
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log(res.data.message)
        setStudents(prevList => prevList.filter(s => s._id !== id))
      })
      .catch(err => console.error("Lỗi khi xóa:", err))
  }

  //Bài 5:
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //Bài 6:
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1
    if (a.name > b.name) return sortAsc ? 1 : -1
    return 0
  })

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>Quản Lý Học Sinh</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label>Họ và Tên</label>
            <input
              className="input-field"
              type="text"
              placeholder="Nhập tên học sinh..."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tuổi</label>
            <input
              className="input-field"
              type="number"
              placeholder="Tuổi"
              value={age}
              onChange={e => setAge(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Lớp</label>
            <input
              className="input-field"
              type="text"
              placeholder="Lớp"
              value={stuClass}
              onChange={e => setStuClass(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-cancel"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Controls Section */}
        <div className="controls">
          <div className="search-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setSortAsc(prev => !prev)}
          >
            Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Họ Tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th style={{ width: '150px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map(student => (
                  <tr key={student._id}>
                    <td><div className="student-name">{student.name}</div></td>
                    <td>{student.age}</td>
                    <td><span className="class-badge">{student.class}</span></td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEditClick(student)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(student._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
