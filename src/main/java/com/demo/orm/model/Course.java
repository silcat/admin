package com.demo.orm.model;

import java.util.Date;
import javax.persistence.*;

public class Course {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 学院id
     */
    @Column(name = "category_id")
    private Integer categoryId;

    /**
     * sku id
     */
    @Column(name = "sku_id")
    private Integer skuId;

    /**
     * 课程名称
     */
    private String name;

    /**
     * 学员人数
     */
    @Column(name = "stu_num")
    private Integer stuNum;

    /**
     * 评分基数
     */
    private Integer scroce;

    /**
     * 上线状态：0:未上线  1：已上线
     */
    private Integer status;

    /**
     * 课程封面
     */
    private String url;

    /**
     * 总节数
     */
    @Column(name = "total_part")
    private Integer totalPart;

    /**
     * 创建人
     */
    @Column(name = "create_user")
    private Integer createUser;

    /**
     * 创建时间
     */
    @Column(name = "create_time")
    private Date createTime;

    /**
     * 上线课程员工
     */
    @Column(name = "update_user")
    private Integer updateUser;

    /**
     * 上线时间
     */
    @Column(name = "update_time")
    private Date updateTime;

    /**
     * 获取id
     *
     * @return id - id
     */
    public Integer getId() {
        return id;
    }

    /**
     * 设置id
     *
     * @param id id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 获取学院id
     *
     * @return category_id - 学院id
     */
    public Integer getCategoryId() {
        return categoryId;
    }

    /**
     * 设置学院id
     *
     * @param categoryId 学院id
     */
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    /**
     * 获取sku id
     *
     * @return sku_id - sku id
     */
    public Integer getSkuId() {
        return skuId;
    }

    /**
     * 设置sku id
     *
     * @param skuId sku id
     */
    public void setSkuId(Integer skuId) {
        this.skuId = skuId;
    }

    /**
     * 获取课程名称
     *
     * @return name - 课程名称
     */
    public String getName() {
        return name;
    }

    /**
     * 设置课程名称
     *
     * @param name 课程名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取学员人数
     *
     * @return stu_num - 学员人数
     */
    public Integer getStuNum() {
        return stuNum;
    }

    /**
     * 设置学员人数
     *
     * @param stuNum 学员人数
     */
    public void setStuNum(Integer stuNum) {
        this.stuNum = stuNum;
    }

    /**
     * 获取评分基数
     *
     * @return scroce - 评分基数
     */
    public Integer getScroce() {
        return scroce;
    }

    /**
     * 设置评分基数
     *
     * @param scroce 评分基数
     */
    public void setScroce(Integer scroce) {
        this.scroce = scroce;
    }

    /**
     * 获取上线状态：0:未上线  1：已上线
     *
     * @return status - 上线状态：0:未上线  1：已上线
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * 设置上线状态：0:未上线  1：已上线
     *
     * @param status 上线状态：0:未上线  1：已上线
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * 获取课程封面
     *
     * @return url - 课程封面
     */
    public String getUrl() {
        return url;
    }

    /**
     * 设置课程封面
     *
     * @param url 课程封面
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * 获取总节数
     *
     * @return total_part - 总节数
     */
    public Integer getTotalPart() {
        return totalPart;
    }

    /**
     * 设置总节数
     *
     * @param totalPart 总节数
     */
    public void setTotalPart(Integer totalPart) {
        this.totalPart = totalPart;
    }

    /**
     * 获取创建人
     *
     * @return create_user - 创建人
     */
    public Integer getCreateUser() {
        return createUser;
    }

    /**
     * 设置创建人
     *
     * @param createUser 创建人
     */
    public void setCreateUser(Integer createUser) {
        this.createUser = createUser;
    }

    /**
     * 获取创建时间
     *
     * @return create_time - 创建时间
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * 设置创建时间
     *
     * @param createTime 创建时间
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 获取上线课程员工
     *
     * @return update_user - 上线课程员工
     */
    public Integer getUpdateUser() {
        return updateUser;
    }

    /**
     * 设置上线课程员工
     *
     * @param updateUser 上线课程员工
     */
    public void setUpdateUser(Integer updateUser) {
        this.updateUser = updateUser;
    }

    /**
     * 获取上线时间
     *
     * @return update_time - 上线时间
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * 设置上线时间
     *
     * @param updateTime 上线时间
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}