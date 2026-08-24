import { useState, Fragment } from 'react'
import { Check, Clock3, Droplets, HandHeart, Sparkles } from 'lucide-react'
import './index.css'

// Mock Data
const STYLISTS = [
  { id: 1, name: 'Ariel', role: '首席療癒師', image: '/healer_ariel.jpg' },
  { id: 2, name: 'Ben', role: '資深療癒師', image: '/healer_ben.jpg' },
  { id: 3, name: 'Chloe', role: '專業療癒師', image: '/healer_chloe.jpg' },
]

const SERVICES = {
  '牛角經絡調理': [
    { id: 's1', name: '臉部 ( 頭+肩頸+臉 )', duration: 60, price: 1500 },
    { id: 's2', name: '背部 ( 頭+肩頸+背和腰 )', duration: 60, price: 1500 },
  ],
  '希塔療癒-深度挖掘': [
    { id: 'c1', name: '針對事件做完整深度療癒', duration: 60, price: 600 },
    { id: 'c2', name: '緊急救援！ＯＫ繃式療癒', duration: 30, price: 300 },
  ],
  '精油抓周': [
    { id: 'p1', name: '抓周+解讀', duration: 20, price: 300 },
  ],
}

const CATEGORY_ICONS = {
  '牛角經絡調理': HandHeart,
  '希塔療癒-深度挖掘': Sparkles,
  '精油抓周': Droplets,
}

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDefaultDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return formatDateKey(date)
}

function App() {
  const [step, setStep] = useState(1)

  // State for selections
  const [selectedStylist, setSelectedStylist] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedDate, setSelectedDate] = useState(getDefaultDate)
  const [selectedTime, setSelectedTime] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const steps = [
    { num: 1, label: '療癒師' },
    { num: 2, label: '服務' },
    { num: 3, label: '時間' },
    { num: 4, label: '資料' },
    { num: 5, label: '確認' }
  ]

  const handleNext = () => setStep(s => Math.min(s + 1, 5))
  const handlePrev = () => setStep(s => Math.max(s - 1, 1))

  // Render Step 1: Stylist
  const renderStep1 = () => (
    <div className="step-content">
      <h2 className="section-title">選擇療癒師</h2>
      <div className="stylist-grid">
        {STYLISTS.map(stylist => (
          <div
            key={stylist.id}
            className={`card ${selectedStylist?.id === stylist.id ? 'selected' : ''}`}
            onClick={() => setSelectedStylist(stylist)}
            style={{ textAlign: 'center', padding: '24px 12px' }}
          >
            <div className="avatar-circle" style={{ width: '64px', height: '64px', margin: '0 auto 12px auto' }}>
              <img src={stylist.image} alt={stylist.name} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{stylist.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stylist.role}</p>
          </div>
        ))}
      </div>
    </div>
  )

  // Render Step 2: Services
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id)
      if (exists) return prev.filter(s => s.id !== service.id)
      return [...prev, service]
    })
  }

  const renderStep2 = () => (
    <div className="step-content">
      <h2 className="section-title">選擇服務項目 (可多選)</h2>
      {Object.entries(SERVICES).map(([category, items]) => {
        const CategoryIcon = CATEGORY_ICONS[category] || Sparkles
        return (
          <div key={category} style={{ marginBottom: '24px' }}>
            <div className="category-title">
              <CategoryIcon size={18} strokeWidth={2} />
              <h3 style={{ fontSize: '16px', color: 'inherit', fontWeight: '600', margin: 0 }}>{category}</h3>
            </div>

            <div className="service-panel">
              <div className="service-list">
                {items.map(item => {
                  const isSelected = selectedServices.some(s => s.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className={`card service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleService(item)}
                    >
                      <div className="service-card-main">
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.name}</div>
                          <div className="service-meta">
                            <Clock3 size={14} strokeWidth={1.8} />
                            {item.duration} 分鐘
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        $ {item.price}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  // Render Step 3: Date & Time
  const renderStep3 = () => {
    // Generate mock dates for 3 weeks starting from tomorrow
    const dates = Array.from({ length: 21 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i + 1)
      return d
    })

    // Mock available times
    const times = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']

    return (
      <div className="step-content">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>選擇日期</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>(僅開放三週內預約)</span>
        </div>
        <div className="date-scroll-container">
          {dates.map((d) => {
            const dateStr = formatDateKey(d)
            const dayName = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
            const isSelected = selectedDate === dateStr
            return (
              <div
                key={dateStr}
                className={`card date-card ${isSelected ? 'selected' : ''}`}
                onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                style={{
                  minWidth: '72px',
                  textAlign: 'center',
                  padding: '12px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '2px' }}>{d.getMonth() + 1}月</div>
                <div style={{ fontSize: '15px', marginBottom: '4px' }}>{dayName}</div>
                <div style={{ fontSize: '22px', fontWeight: '600' }}>{d.getDate()}</div>
              </div>
            )
          })}
        </div>

        {selectedDate && (
          <div style={{ marginTop: '24px', animation: 'fadeIn 0.3s' }}>
            <h2 className="section-title">選擇時段</h2>
            <div className="time-grid">
              {times.map(t => {
                const isUnavailable = false
                return (
                  <button
                    key={t}
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      height: '52px',
                      borderRadius: '8px',
                      border: `1px solid ${selectedTime === t ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      backgroundColor: isUnavailable ? 'var(--disabled-bg)' : (selectedTime === t ? 'var(--primary-color)' : 'var(--surface-color)'),
                      color: isUnavailable ? 'var(--disabled-text)' : (selectedTime === t ? '#fff' : 'var(--primary-color)'),
                      fontWeight: selectedTime === t ? '600' : '400',
                      fontSize: '16px',
                      cursor: isUnavailable ? 'not-allowed' : 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Step 4: Info
  const renderStep4 = () => (
    <div className="step-content">
      <h2 className="section-title">預約資訊</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="form-label">姓名</label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px' }}
            placeholder="請輸入姓名"
          />
        </div>
        <div>
          <label className="form-label">電話號碼</label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px' }}
            placeholder="0912345678"
          />
        </div>
        <div>
          <label className="form-label">Email (選填)</label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px' }}
            placeholder="example@gmail.com"
          />
        </div>
      </div>
    </div>
  )

  // Render Step 5: Confirmation
  const renderStep5 = () => {
    const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0)

    return (
      <div className="step-content">
        <h2 className="section-title">確認預約資訊</h2>
        <div className="receipt-wrapper">
          <div className="receipt-card">
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500' }}>預約日期與時間</div>
              <div className="confirm-value">
                <span style={{ marginRight: '16px' }}>{selectedDate}</span>
                <span>{selectedTime}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500' }}>預約療癒師</div>
              <div className="confirm-value">{selectedStylist?.name}</div>
            </div>

            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500' }}>服務項目</div>
              {selectedServices.map(s => (
                <div key={s.id} className="confirm-row">
                  <div>
                    {s.name} <span className="confirm-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '400' }}><Clock3 size={13} strokeWidth={2} />{s.duration} 分鐘</span>
                  </div>
                  <div>$ {s.price}</div>
                </div>
              ))}
              <div className="confirm-row confirm-total">
                <div>總計</div>
                <div>$ {totalPrice}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500' }}>聯絡人</div>
              <div className="confirm-value">{customerInfo.name} ({customerInfo.phone})</div>
              <div className="confirm-value">{customerInfo.email || '未填寫'}</div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '24px' }}>
          按下確認預約後，系統將發送 Line 通知給您，並由療癒師為您確認最終時段。
        </p>
      </div>
    )
  }

  // Determine if 'Next' button should be disabled
  const isNextDisabled = () => {
    if (step === 1 && !selectedStylist) return true
    if (step === 2 && selectedServices.length === 0) return true
    if (step === 3 && (!selectedDate || !selectedTime)) return true
    if (step === 4 && (!customerInfo.name || !customerInfo.phone)) return true
    return false
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header" style={{ justifyContent: 'center' }}>
        <div className="header-title">我要預約</div>
      </header>

      {/* Steps Indicator */}
      <div className="stepper-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 20px', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
        {steps.map((s, index) => {
          const isCompleted = step > s.num
          const isCurrent = step === s.num
          return (
            <Fragment key={s.num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary-color)' : 'transparent',
                  border: `2px solid ${isCompleted || isCurrent ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  color: isCompleted || isCurrent ? 'var(--surface-color)' : 'var(--text-secondary)',
                  fontSize: '13px', fontWeight: '500', marginBottom: '8px'
                }}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <div style={{ fontSize: '13px', color: isCompleted || isCurrent ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {s.label}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: step > s.num ? 'var(--primary-color)' : 'var(--border-color)',
                  marginTop: '13px',
                  marginLeft: '-4px',
                  marginRight: '-4px',
                  zIndex: 1,
                  transition: 'var(--transition)'
                }} />
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Main Content Area */}
      <main className="content-area">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </main>

      {/* Bottom Navigation */}
      <div className="bottom-actions">
        {step > 1 && (
          <button className="btn-outline" onClick={handlePrev} style={{ flex: '0 0 auto' }}>
            上一步
          </button>
        )}

        {step < 5 ? (
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={isNextDisabled()}
            style={{ opacity: isNextDisabled() ? 0.5 : 1 }}
          >
            下一步
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setShowSuccessModal(true)}
          >
            確認預約
          </button>
        )}
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="card success-modal" style={{ 
            width: '100%', 
            maxWidth: '360px', 
            textAlign: 'center', 
            padding: '40px 24px',
            backgroundColor: 'var(--surface-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Check size={64} strokeWidth={2.6} color="var(--primary-color)" />
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--primary-color)', marginBottom: '12px', fontWeight: '600' }}>預約送出！</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '28px', lineHeight: '1.5' }}>
              我們會透過Line傳送是否預約成功<br/>請留意您的訊息
            </p>
            <button 
              className="btn-primary" 
              onClick={() => {
                setShowSuccessModal(false);
                // Reset form
                setStep(1);
                setSelectedStylist(null);
                setSelectedServices([]);
                setSelectedTime(null);
                setCustomerInfo({ name: '', phone: '', email: '' });
              }}
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
