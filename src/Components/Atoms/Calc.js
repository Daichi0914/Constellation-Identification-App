const LocalSiderealTimeCalc = ({ Year, Month, Day, Longitude, LongitudeRef }) => {
    const Y = Year - 1
    const M = () => {
      switch (Month) {
        case 1:
          return 13;
        case 2:
          return 14;
        default:
          return Month;
      }
    }
    const D = Day
    const Ramda = () => {
      switch (LongitudeRef) {
        case 'E':
          return -1 * Longitude;
        case 'W':
          return Longitude;
      }
    }
    // 準ユリウス時
    const MJD = 365.25 * Y + Y / 400 - Y / 100 + 30.59 * (M() - 2) + D + 1721088.5 - 2400000.5;
    // グリニッジ恒星時
    const GST = 24 * (0.67239 + 1.00273781 * (MJD-40000.0))
    // 地方恒星時
    return GST - Ramda()
}
