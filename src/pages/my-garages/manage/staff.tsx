import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAddStaff, useGetStaffs } from '@/api';
import { SingleUploadDragger } from '@/components';
import { VIETNAM_PROVINCES } from '@/constants';
import { ManageGarageLayout } from '@/layouts';
import { confirmPasswordRule, emailRule, requiredRule } from '@/services';

const locationCascaderOptions = VIETNAM_PROVINCES.map((province) => ({
  label: province.name,
  value: province.code,
  children: province.districts.map((district) => ({
    label: district.name,
    value: district.code,
  })),
}));

function UpsertStaffModalContent(props: {
  onCancel?: () => void;
  garageID: number;
}) {
  const { onCancel, garageID } = props;

  const { mutateAsync: addStaff, isLoading: addingStaff } = useAddStaff();

  return (
    <Form
      className="pt-6"
      layout="vertical"
      onFinish={async (values) => {
        await addStaff({
          body: {
            ...values,
            provinceId: values?.address?.[0],
            districtId: values?.address?.[1],
            garageID,
          },
        });
        onCancel?.();
      }}
    >
      <Typography.Title level={3} className="text-center mb-10">
        Thêm nhân viên
      </Typography.Title>

      <div className="flex gap-6">
        <div className="grow max-h-[60vh] overflow-scroll pr-4">
          <Form.Item
            label="ID Nhân viên"
            name="employeeId"
            rules={[requiredRule()]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tên nhân viên" name="name" rules={[requiredRule()]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="emailAddress"
            rules={[requiredRule(), emailRule()]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[requiredRule()]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="retypePassword"
            rules={[requiredRule(), confirmPasswordRule()]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[requiredRule()]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender" rules={[requiredRule()]}>
            <Select
              options={[
                { label: 'Name', value: 'Nam' },
                { label: 'Nữ', value: 'Nữ' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Cascader options={locationCascaderOptions} />
          </Form.Item>

          <Form.Item
            label="Địa chỉ cụ thể"
            name="addressDetail"
            rules={[requiredRule()]}
          >
            <Input />
          </Form.Item>
        </div>

        <div>
          <Form.Item name="linkImage" label="Ảnh đại diện">
            <SingleUploadDragger />
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          className="min-w-[200px]"
          type="primary"
          htmlType="submit"
          disabled={addingStaff}
          loading={addingStaff}
        >
          Thêm
        </Button>
      </div>
    </Form>
  );
}

export default function GarageStaffManagementPage() {
  const { query } = useRouter();

  const {
    data: staffs,
    isLoading: fetchingStaffs,
    refetch,
  } = useGetStaffs({
    enabled: !isNaN(Number(query?.garageId)),
    id: Number(query?.garageId),
  });

  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <Typography.Title level={3}>Quản lý nhân viên</Typography.Title>

        <div className="flex justify-end mb-10">
          <Button type="primary" onClick={() => setOpen(true)}>
            Thêm nhân viên
          </Button>
        </div>

        <Skeleton active loading={fetchingStaffs}>
          <Table
            dataSource={staffs}
            columns={[
              { title: 'ID', dataIndex: 'employeeId' },
              { title: 'Tên', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'emailAddress' },
              { title: 'Giới tính', dataIndex: 'gender' },
              { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
            ]}
          />
        </Skeleton>
      </div>

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={900}
      >
        <UpsertStaffModalContent
          onCancel={() => {
            setOpen(false);
            refetch();
          }}
          garageID={Number(query?.garageId)}
        />
      </Modal>
    </>
  );
}

GarageStaffManagementPage.Layout = ManageGarageLayout;
