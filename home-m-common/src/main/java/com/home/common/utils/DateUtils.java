package com.home.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * @author dyc
 * @date 2015年11月13日上午11:01:03 
 * @version 1.0
 */
public class DateUtils {

	Logger logger = LoggerFactory.getLogger(DateUtils.class);

	/**
     * 
     * @param d1
     * @param d2
     * @return
     */
    public static Boolean compareSameDate(Date d1,Date d2){ 
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); 
        String s1 = sdf.format(d1); 
        String s2 = sdf.format(d2); 
        return s1.equals(s2)?true:false; 
    }  
    
	/**
	 *
	 * @param d1
	 * @param d2
	 * @return
	 */
	public static Boolean compareDate(Date d1,Date d2){ 
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
	    String s1 = sdf.format(d1); 
	    String s2 = sdf.format(d2);
		return s1.equals(s2);
	}  
	/**
	 * @param endday
	 * @return
	 * @throws Exception
	 */
	public static Date getDateEndDay(String endday)throws Exception{
		SimpleDateFormat formatdate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		endday = endday + " 23:59:59";
		return formatdate.parse(endday);
	}	
	
	/**
	 * @param endday
	 * @return
	 * @throws Exception
	 */
	public static Date getDateByTimeType(String endday)throws Exception{
		SimpleDateFormat formatdate = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		return formatdate.parse(endday);
	}	

	public static String getDateHour(Date date) throws Exception{
		SimpleDateFormat formatdate = new SimpleDateFormat("HH");	
		Integer hh=Integer.valueOf(formatdate.format(date));
		if(hh>12){
			hh=hh-12;
			}
		return String.valueOf(hh);
	}

	public static String getDateMinute(Date date) throws Exception{
		SimpleDateFormat formatdate = new SimpleDateFormat("mm");	
		return formatdate.format(date);
	}
	public static Calendar getMonthFirst(Date date){
		  Calendar cal=Calendar.getInstance();
		  cal.setTime(date);
	      cal.add(Calendar.MONTH, 0);
	      cal.set(Calendar.DAY_OF_MONTH,1);
	      return cal;
	}
	
	public static String initDate(Date date,short time){
		SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date_ = new Date(date.getTime()+time*60*1000);
		return sf.format(date_);
	}
	
	public static Calendar getMonthLast(Date date){
		  Calendar cal=Calendar.getInstance();
		  cal.setTime(date);
	      cal.add(Calendar.MONTH, +1);
	      cal.set(Calendar.DAY_OF_MONTH,1);
	      cal.add(Calendar.DAY_OF_MONTH,-1);
	      return cal;
	}
	
	public static Calendar setDate(Date date,int n){
		  Calendar cal=Calendar.getInstance();
		  cal.setTime(date);
		  if(n/cal.getActualMaximum(Calendar.DAY_OF_MONTH)>0){
			  cal.add(Calendar.MONTH, +n/cal.getActualMaximum(Calendar.DAY_OF_MONTH));
			  cal.add(Calendar.DAY_OF_MONTH, +n%cal.getActualMaximum(Calendar.DAY_OF_MONTH));
		  }else{
			  cal.add(Calendar.DAY_OF_MONTH, +n); 
		  }
	      return cal;
	}
	
	public static int days(Date date,int n){
		  Calendar cal=Calendar.getInstance();
		  cal.setTime(getMonthLast(date).getTime());
		  int m = cal.get(Calendar.DAY_OF_WEEK)-1;
		  if(m<n){
			  m=m+7-n;
		  }else{
			  m=m-n;
		  }
	      return m;
	}
	
	public static Calendar days_(Date date,int n){
		  Calendar cal=Calendar.getInstance();
		  cal.setTime(date);
		  cal.add(Calendar.MONTH, +n);
	      return cal;
	}
	
	
	public static short stringToShort(int s){
		short sh = Integer.valueOf(s).shortValue();
		return sh;
	}
	
	public static int checkEventDate(Date start,Date end){
		int flag = 2;
		if(start.before(end)){
			Calendar cal_start = Calendar.getInstance();
			cal_start.setTime(start);
			Calendar cal_end = Calendar.getInstance();
			cal_end.setTime(end);
			if(cal_start.get(Calendar.YEAR)==cal_end.get(Calendar.YEAR)){
				if(cal_start.get(Calendar.MONTH)==cal_end.get(Calendar.MONTH)){
					if(cal_start.get(Calendar.DAY_OF_MONTH) == cal_end.get(Calendar.DAY_OF_MONTH)){
						flag = 0;
					}else{
						flag = 1;
					}					
				}else{
					flag = 2;
				}
			}else if(cal_start.get(Calendar.YEAR)<cal_end.get(Calendar.YEAR)){
				flag = 3;
			}
		}
		return flag;
	}
	
	public static void main(String []args){
		Date date = new Date();
		System.out.println(changeWeek(date,0,0));
	}
	/**
	 * 
	 * @return String
	 */
	public static String getTimeRan() {
		Random random = new Random();
		String result = "";
		for (int i = 0; i < 4; i++) {
			result += random.nextInt(10);
		}
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMddHHmmss");
		return dateFormat.format(date) + result;
	}

	/**
	 * @return
	 */
	public static String getYearTime() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy");
		return dateFormat.format(date);
	}
	
	/**
	 * 获取 MM
	 * @return
	 */
	public static String getMonthTime() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("MM");
		return dateFormat.format(date);
	}
	
	/**
	 * 获取 dd
	 * @return
	 */
	public static String getDayTime() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd");
		return dateFormat.format(date);
	}
	
	/*
	 * 获取 dd
	 */
	public static String getDay(Date date){
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd");
		return dateFormat.format(date);
	}

	public static String getYearAndMonth(Date date){
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM");
		return dateFormat.format(date);
	}
	
    public static String getAllDateFormat(Date date){
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy年MM月dd日 EEE HH:mm");
        return dateFormat.format(date);
    }

	/**
	 * 
	 * @return String
	 * @throws ParseException
	 */
	public static Date shiftDate(Date date, int days, int hours, int minutes)
			throws ParseException {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, -days);
		cal.add(Calendar.HOUR, -hours);
		cal.add(Calendar.MINUTE, -minutes);
		return cal.getTime();
	}

	public static Date getBeginDateOfToday() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_MONTH,
				calendar.get(Calendar.DAY_OF_MONTH) - 1);
		return calendar.getTime();
	}

	public static Date getBeginDateOfYesterDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_MONTH,
				calendar.get(Calendar.DAY_OF_MONTH) - 2);
		return calendar.getTime();
	}

	public static Date getBeginDateOfThisWeek() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.AM);
		calendar.set(Calendar.HOUR, calendar.getActualMinimum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMinimum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMinimum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_WEEK, calendar
				.getActualMinimum(Calendar.DAY_OF_WEEK));
		return calendar.getTime();
	}

	public static Date getBeginDateOfLastWeek() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - 7);
		calendar.set(Calendar.DAY_OF_WEEK, calendar
				.getActualMinimum(Calendar.DAY_OF_WEEK));
		return calendar.getTime();
	}

	public static Date getBeginDateOfThreeDaysBefore() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_MONTH,
				calendar.get(Calendar.DAY_OF_MONTH) - 3);
		return calendar.getTime();
	}

	public static Date getMonthBeginDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_MONTH, calendar
				.getActualMinimum(Calendar.DAY_OF_MONTH) - 1);
		return calendar.getTime();
	}

	public static Date getBeforBeginOneDay(Date beginDate) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(beginDate);
		cal.add(Calendar.DAY_OF_MONTH, -1);
		return cal.getTime();
	}

	public static Date getAfterBeginOneDay(Date beginDate) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(beginDate);
		cal.add(Calendar.DAY_OF_MONTH, 1);
		return cal.getTime();
	}

	public static Date getThreeMonthBeginDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_MONTH, calendar
				.getActualMinimum(Calendar.DAY_OF_MONTH) - 3);
		return calendar.getTime();
	}

	public static Date getLastMonthBeginDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		calendar.set(Calendar.DAY_OF_MONTH, calendar
				.getActualMinimum(Calendar.DAY_OF_MONTH) - 2);
		return calendar.getTime();
	}

	public static Date getYearBeginDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		calendar.set(Calendar.DAY_OF_YEAR, calendar
				.getActualMinimum(Calendar.DAY_OF_YEAR) - 1);
		return calendar.getTime();
	}

	public static final Date getMinWeekDay(int i) {
		return processMinTime(getWeekDay(i));
	}

	public static final Date getMaxWeekDay(int i) {
		return processMaxTime(getWeekDay(i));
	}

	private static final Calendar getWeekDay(int i) {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_WEEK, calendar
				.getActualMinimum(Calendar.DAY_OF_WEEK));
		calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR)
				+ i);
		return calendar;
	}

	public static final Date getMinMonthDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_MONTH, calendar
				.getActualMinimum(Calendar.DAY_OF_MONTH));
		return processMinTime(calendar);
	}

	public static final Date getMaxMonthDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_MONTH, calendar
				.getActualMaximum(Calendar.DAY_OF_MONTH));
		return processMaxTime(calendar);
	}

	private static final Date processMaxTime(Calendar calendar) {
		calendar.set(Calendar.AM_PM, Calendar.PM);
		calendar.set(Calendar.HOUR, calendar.getActualMaximum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMaximum(Calendar.SECOND));
		return calendar.getTime();
	}

	private static final Date processMinTime(Calendar calendar) {
		calendar.set(Calendar.AM_PM, Calendar.AM);
		calendar.set(Calendar.HOUR, calendar.getActualMinimum(Calendar.HOUR));
		calendar.set(Calendar.MINUTE, calendar
				.getActualMinimum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar
				.getActualMinimum(Calendar.SECOND));
		return calendar.getTime();
	}

	/**
	 * �õ�����ĵ�һ��
	 * 
	 * @return
	 */
	public static Date getYearFirstDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar
				.getActualMinimum(Calendar.MONTH), calendar
				.getActualMinimum(Calendar.DAY_OF_MONTH), 0, 0, 0);
		return calendar.getTime();
	}

	/**
	 * �õ���������һ��
	 * 
	 * @return
	 */
	public static String getYearLastDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar
				.getActualMaximum(Calendar.MONTH), calendar
				.getActualMaximum(Calendar.DATE), 0, 0, 0);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return formatMe(calendar.getTime());
	}

	/**
	 * �õ����µĵ�һ��
	 * 
	 * @return
	 */
	public static Date getMonthFirstDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
				calendar.getActualMinimum(Calendar.DAY_OF_MONTH), 0, 0, 0);
		return calendar.getTime();
	}

	/**
	 * �õ����µ����һ��
	 * 
	 * @return
	 */
	public static String getMonthLastDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
				calendar.getActualMaximum(Calendar.DAY_OF_MONTH), 0, 0, 0);
		// calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND)-1);
		return formatMe(calendar.getTime());
	}

	/**
	 * �õ����ܵĵ�һ��
	 * 
	 * @return
	 */
	public static String getWeekFirstDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
				calendar.get(Calendar.DAY_OF_WEEK_IN_MONTH), 0, 0, 0);
		return formatMe(calendar.getTime());
	}

	/**
	 * �õ����ܵ����һ��
	 * 
	 * @return
	 */
	public static String getWeekLastDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
				calendar.getActualMaximum(Calendar.DAY_OF_WEEK) + 1, 0, 0, 0);
		calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND) - 1);
		return formatMe(calendar.getTime());
	}

	public static String formatMe(Date d1) {
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		String s = f.format(d1);
		return s;
	}


	
	/**
     * ���ڸ�ʽ�� yyyy-MM-dd HH:mm:ss
     * @param date
     * @return
     * @author xiaojianyu
     */
    public static String formatDateYMDHMS(Date date) {
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String s = f.format(date);
        return s;
    }
    
    /**
     * 日期转换成字符串 yyyy-MM-dd
     * @param date
     * @return
     */
    public static String formatDateYMD(Date date) {
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
        String s = f.format(date);
        return s;
    }
	public static String formatDateMD(Date date) {
		SimpleDateFormat f = new SimpleDateFormat("MM-dd");
		String s = f.format(date);
		return s;
	}
    
	public static Date formatYmd(String d1) throws ParseException {
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		return f.parse(d1);
	}
	
	public static List<String> getDays(String from, String to)
			throws ParseException {
		SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd");
		Calendar start = Calendar.getInstance();
		Calendar end = Calendar.getInstance();

		start.setTime(formater.parse(from));
		end.setTime(formater.parse(to));

		List<String> list = new ArrayList<String>();
		SimpleDateFormat outformat = new SimpleDateFormat("yyyy��MM��dd��");
		while (start.compareTo(end) <= 0) {
			String day1 = outformat.format(start.getTime()); // start.get(Calendar.YEAR)+"��"+(start.get(Calendar.MONTH)+1)+"��"+start.get(Calendar.DATE)+"��";
			list.add(day1);
			start.add(Calendar.DATE, 1);
		}
		return list;
	}

	// �±���Щ������Ϊ�˻�ȡ�ܷ�Χ
	public static Date getWeekBegin() {
		Calendar cal = Calendar.getInstance();
		Date date = new Date();
		cal.setTime(date);
		Date mm = nDaysAgo(cal.get(Calendar.DAY_OF_WEEK) - 2, date);
		return getDayBegin(mm);
	}

	public static Date getWeekEnd() {
		Calendar cal = Calendar.getInstance();
		Date date = new Date();
		cal.setTime(date);
		Date mm = nDaysAfter(8 - cal.get(Calendar.DAY_OF_WEEK), date);
		return getDayEnd(mm);

	}

	public static Date getDayBegin(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal
				.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
		return cal.getTime();
	}

	public static Date nDaysAfter(int n, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.DAY_OF_MONTH, cal.get(Calendar.DAY_OF_MONTH) + n);
		return cal.getTime();
	}
	
	public static Date nDaysAgo(Integer n, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.DAY_OF_MONTH, cal.get(Calendar.DAY_OF_MONTH) - n);
		return cal.getTime();
	}

	public static Date nHoursAgo(Integer n, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, cal.get(Calendar.HOUR_OF_DAY) - n);
		return cal.getTime();
	}
	
	public static Date nMinutesAgo(Integer n, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.MINUTE, cal.get(Calendar.MINUTE) - n);
		return cal.getTime();
	}
	
	public static Date nMinutesAfter(int n, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.MINUTE, cal.get(Calendar.MINUTE) + n);
		return cal.getTime();
	}
	
	public static Date getDayEnd(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal
				.get(Calendar.DAY_OF_MONTH) + 1, 0, 0, 0);
		cal.set(Calendar.SECOND, cal.get(Calendar.SECOND) - 1);

		return cal.getTime();
	}

	/**
	 * ȡ�õ�ǰ���������ܵĵ�һ��
	 * 
	 * @param date
	 * @return
	 */
	public static Date getFirstDayOfWeek(Date date) {
		Calendar c = new GregorianCalendar();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}
	
	public static String changeWeek(Date date,int language,int type) {
		SimpleDateFormat sf = new SimpleDateFormat("HH:mm");
		SimpleDateFormat sf_ = new SimpleDateFormat("yyy-MM-dd");
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int week_day = c.get(Calendar.DAY_OF_WEEK);
		String week = "";
		if(language == 0){
			switch(week_day){
				case 1:week="����";break;
				case 2:week="��һ";break;
				case 3:week="�ܶ�";break;
				case 4:week="����";break;
				case 5:week="����";break;
				case 6:week="����";break;
				case 7:week="����";break;
				default:break;
			}
		}else{
			switch(week_day){
				case 1:week="Sun";break;
				case 2:week="��һ";break;
				case 3:week="�ܶ�";break;
				case 4:week="����";break;
				case 5:week="����";break;
				case 6:week="����";break;
				case 7:week="����";break;
				default:break;
			}
		}
		
		if(type == 0){
			return week+" "+sf.format(date);
		}else{
			return sf_.format(date)+" "+week+" "+sf.format(date);
		}
		
	}

	public static String changeDate(Date date,int language,int type) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH)+1;
		int day = c.get(Calendar.DAY_OF_MONTH);
		String month_ = "";
		String day_ = "";
		if(month<10){
			month_ = "0"+month;
		}else{
			month_ = month+"";
		}
		if(day<10){
			day_ = "0"+day;
		}else{
			day_ = day+"";
		}
		String dateVar = "";
		if(language == 0){
			if(type == 0){
				dateVar = day_+"��";
			}
			if(type == 1){
				dateVar = month_+"��"+day_+"��";
			}
			if(type == 2){
				dateVar = year+"��"+month_+"��"+day_+"��";
			}			
		}else{
			dateVar = year+"Y"+month+"M"+day+"D";
		}		
		return dateVar;
	}
	
	/**
	 * ȡ�õ�ǰ���������ܵ����һ��
	 * 
	 * @param date
	 * @return
	 */
	public static Date getLastDayOfWeek(Date date) {
		Calendar c = new GregorianCalendar();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6); // Sunday
		return c.getTime();
	}

	/**
	 * ����ʱ����������������Сʱ���ٷֶ�����
	 * 
	 * @return String ����ֵΪ��xx��xxСʱxx��xx��
	 */
	public static long[] getDistanceTime(Date one, Date two) {
		long time1 = one.getTime();
		long time2 = two.getTime();
		long diff = time2 - time1;

		long day = diff / (24 * 60 * 60 * 1000);
		long hour = (diff / (60 * 60 * 1000) - day * 24);
		long min = ((diff / (60 * 1000)) - day * 24 * 60 - hour * 60);
		long sec = (diff / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
		long[] times = { day, hour, min, sec };
		return times;
	}

	public static long getDistanceMinTime(Date one, Date two) {
		long time1 = one.getTime();
		long time2 = two.getTime();
		long diff = time2 - time1;
		long min = diff / (60 * 1000);
		return min;
	}
	
	/**
	 * ����ʱ������ڼ�
	 * 
	 * @param date
	 * @return
	 */
	public static String getWeek(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("E");
		String week = sdf.format(date);
		week = week.replace("Mon", "����һ");
		week = week.replace("Tue", "���ڶ�");
		week = week.replace("Wed", "������");
		week = week.replace("Thu", "������");
		week = week.replace("Fri", "������");
		week = week.replace("Sat", "������");
		week = week.replace("Sun", "������");
		return week;
	}

	/**
	 * ����ʱ���Ӣ�����ڼ�
	 * 
	 * @param date
	 * @return
	 */
	public static String getWeek_EN(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("E");
		String week = sdf.format(date);
		week = week.replace("����һ", "Mon");
		week = week.replace("���ڶ�", "Tue");
		week = week.replace("������", "Wed");
		week = week.replace("������", "Thu");
		week = week.replace("������", "Fri");
		week = week.replace("������", "Sat");
		week = week.replace("������", "Sun");
		return week;
	}

	/**
	 * ����ʱ�����������
	 * 
	 * @param date
	 * @return
	 */
	public static String getChangeM(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("a");
		String week = sdf.format(date);
		week = week.replace("Am", "����");
		week = week.replace("Pm", "����");
		week = week.replace("AM", "����");
		week = week.replace("PM", "����");
		return week;
	}

	/**
	 * ����ʱ���Ӣ����������
	 * 
	 * @param date
	 * @return
	 */
	public static String getChangeM_EN(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("a");
		String week = sdf.format(date);
		week = week.replace("����", "Am");
		week = week.replace("����", "Pm");
		return week;
	}
	/**
	 * �����n
	 * 
	 * @param date
	 * @return
	 */
	public static Date getDayOfMonth(Date date, int day) {
		Calendar c = new GregorianCalendar();
		c.setTime(date);
		c.set(Calendar.DAY_OF_MONTH, c.getTime().getDate() + day);
		return c.getTime();
	}

	/**
	 * ʱ��Ϊtime
	 * 
	 * @param date
	 * @return
	 */
	public static Date getAddTime(Date date, int num) {
		Calendar c = new GregorianCalendar();
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, c.getTime().getHours() + num);
		return c.getTime();
	}

	/**
	 * ʱ��Ϊtime
	 * 
	 * @param date
	 * @return
	 */
	public static Date getTime(Date date, int time) {
		Calendar c = new GregorianCalendar();
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, time);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		return c.getTime();
	}

	/**
	 * ��ȡĳ���·ݵ����һ������
	 * @param year
	 * @param month
	 * @return
	 * @throws ParseException
	 */
	public static int getMonthLastDay(int year,int month) throws ParseException{
		Calendar date = Calendar.getInstance();
		if(month==1){
			month=12;
		}
		date.set(year,month-1,1);
		return date.getActualMaximum(Calendar.DAY_OF_MONTH);	
	}
	
	/**
	 * �����ܼ���1��������գ�2�������һ����������
	 * @param date
	 * @return
	 */
	public static int getWeekDate(Date date){
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return(cal.get(Calendar.DAY_OF_WEEK));
	}
	

	
	/**
	 * ����һ����ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getLastMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -1);
		return calendar;
	}
	
	/**
	 * ���������ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getTwoMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -2);
		return calendar;
	}
	
	/**
	 * ���������ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getThreeMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -3);
		return calendar;
	}
	
	/**
	 * �����ĸ���ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getFourMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -4);
		return calendar;
	}
	
	/**
	 * ���������ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getFiveMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -5);
		return calendar;
	}
	
	/**
	 * ���������ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getSixMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -6);
		return calendar;
	}
	
	/**
	 * �����߸���ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getSevenMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -7);
		return calendar;
	}
	
	/**
	 * ����˸���ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getEightMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -8);
		return calendar;
	}
	
	/**
	 * ����Ÿ���ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getNineMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -9);
		return calendar;
	}
	
	/**
	 * ����ʮ����ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getTenMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -10);
		return calendar;
	}
	
	/**
	 * ����ʮһ����ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getElevenMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -11);
		return calendar;
	}
	
	/**
	 * ����ʮ������ǰ
	 * @param now
	 * @return
	 */
	public static Calendar getTwelMonth(Date now){
		Calendar calendar =Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(GregorianCalendar.MONTH, -12);
		return calendar;
	}
}
