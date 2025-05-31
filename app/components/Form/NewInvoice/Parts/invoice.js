// app/components/form/NewInvoice/Parts/invoice.js

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// ✅ Register Arabic font (regular and bold)
Font.register({
  family: 'tajawal',
  fonts: [
    {
      src: 'http://localhost:3000/fonts/Tajawal-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'http://localhost:3000/fonts/Tajawal-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'tajawal',
    fontWeight: 'bold', // ✅ All text appears bold by default
    backgroundColor: '#fff',
    color: '#111', // ✅ Darker font color
    lineHeight: 1.5,
  },
  row: { flexDirection: 'row', width: '100%' },
  headerImage: { width: 60, height: 60, marginRight: 10 },
  headerRight: { flex: 1, textAlign: 'right', direction: 'rtl' },

  h3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },

    h5: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#515555',
  },




  bold: { fontWeight: 'bold' },

  section: { marginBottom: 16 },
  field: { marginBottom: 2 },
  label: { fontWeight: 'bold', marginRight: 4 },

  table: {
    display: 'table',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    minHeight: 24,
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  colSmall: { width: '5%' },
  colMedium: { width: '15%' },
  colLarge: { width: '65%', textAlign: 'left' },

summaryTable: {
  width: '60%',
  marginLeft: 'auto',
  marginTop: 16,
  borderWidth: 1,
  borderColor: '#ccc',
  borderStyle: 'solid',
  },


  summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderColor: '#ccc',
  padding: 6,
  },

  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 10,
    color: '#555',
  },

  summaryWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 16,
  alignItems: 'flex-start',
},

stampImage: {
  width: 100,
  height: 100,
  marginRight: 10,
  objectFit: 'contain',
},


});

export const InvoicePDF = ({ headerData, midData, products, summary }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header */}
      <View style={[styles.row, styles.section, { alignItems: 'center' }]}>
        <Image src="/logo.png" style={styles.headerImage} />
        <View style={styles.headerRight}>
          <Text style={styles.h3}>خياط زهرة الفردوس</Text>
          <Text>مكان خاص للدشداشة</Text>
          <Text>احدث انواع الاقمشة والخياطة الرجالية والجاهزة</Text>
          <Text>الفحيحيل - شارع مكة - بناية قيس الغانم - الطابق الأرضي محل رقم ٦٢</Text>
          <Text><Text style={styles.label}>رقم تيلفون :-</Text> 66396881 / 51235130</Text>
        </View>
      </View>

      {/* Client + Invoice Details */}
      <View style={[styles.row, styles.section]}>
        <View style={{ width: '50%' }}>
          <Text style={styles.h5}>تفاصيل العميل</Text>
          <Text style={styles.field}><Text style={styles.label}>Name:</Text>{headerData.clientName}</Text>
          <Text style={styles.field}><Text style={styles.label}>Phone:</Text>{headerData.contactNumber}</Text>
          {midData.address && (
            <Text style={styles.field}><Text style={styles.label}>Address:</Text>{midData.address}</Text>
          )}
          <Text style={[styles.h5, { marginTop: 10 }]}>تفاصيل الفاتورة</Text>
          {headerData.referenceNumber && (
            <Text style={styles.field}><Text style={styles.label}>Reference:</Text>{headerData.referenceNumber}</Text>
          )}
          {headerData.serialNumber && (
            <Text style={styles.field}><Text style={styles.label}>Serial No:</Text>{headerData.serialNumber}</Text>
          )}
          {midData.paymentMode && (
            <Text style={styles.field}><Text style={styles.label}>Payment Mode:</Text>{midData.paymentMode}</Text>
          )}
        </View>

        <View style={{ width: '50%', textAlign: 'right' }}>
          <Text style={styles.h5}>الفاتورة</Text>
          <Text style={styles.field}><Text style={styles.label}>Invoice No:</Text>{headerData.invoiceNumber}</Text>
          <Text style={styles.field}><Text style={styles.label}>Date:</Text>{headerData.invoiceDate}</Text>
          <Text style={styles.field}><Text style={styles.label}>Delivery:</Text>{midData.deliveryDate}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={[styles.tableCol, styles.colSmall, styles.bold]}>#</Text>
          <Text style={[styles.tableCol, styles.colLarge, styles.bold]}>Product</Text>
          <Text style={[styles.tableCol, styles.colMedium, styles.bold]}>Qty</Text>
          <Text style={[styles.tableCol, styles.colMedium, styles.bold]}>Rate (KWD)</Text>
          <Text style={[styles.tableCol, styles.colMedium, styles.bold]}>Amount (KWD)</Text>
        </View>

        {products.map((p, i) => (
          <View
            style={[
              styles.tableRow,
              { backgroundColor: i % 2 === 0 ? '#fff' : '#f9f9f9' },
            ]}
            key={i}
          >
            <Text style={[styles.tableCol, styles.colSmall]}>{i + 1}</Text>
            <Text style={[styles.tableCol, styles.colLarge]}>{p.name}</Text>
            <Text style={[styles.tableCol, styles.colMedium]}>{p.quantity}</Text>
            <Text style={[styles.tableCol, styles.colMedium]}>
              {parseFloat(p.rate).toFixed(2)}
            </Text>
            <Text style={[styles.tableCol, styles.colMedium]}>
              {parseFloat(p.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
    <View style={styles.summaryWrapper}>
  {/* Stamp Image (Left) */}
  <Image src="/stamp.png" style={styles.stampImage} />

  {/* Summary Table (Right) */}
<View style={styles.summaryTable}>
  <View style={styles.summaryRow}>
    <Text style={styles.bold}>Subtotal</Text>
    <Text>KWD {summary.total.toFixed(2)}</Text>
  </View>
  <View style={styles.summaryRow}>
    <Text style={styles.bold}>Discount</Text>
    <Text>- KWD {summary.discount.toFixed(2)}</Text>
  </View>
  <View style={styles.summaryRow}>
    <Text style={styles.bold}>Advance Paid</Text>
    <Text>KWD {summary.advance.toFixed(2)}</Text>
  </View>
  <View style={styles.summaryRow}>
    <Text style={styles.bold}>Total Payable</Text>
    <Text>KWD {summary.final.toFixed(2)}</Text>
  </View>
  <View style={[styles.summaryRow, { borderBottomWidth: 0, color: 'red' }]}>
    <Text style={styles.bold}>Pending</Text>
    <Text>KWD {summary.pending.toFixed(2)}</Text>
  </View>
</View>

    </View>


      {/* Footer */}
      <View style={styles.footerText}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);
